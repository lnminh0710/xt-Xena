using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using XenaUI.Models;
using XenaUI.Service;
using XenaUI.Service.Models;
using XenaUI.Utils;

namespace XenaUI.Business
{
    public class ShipmentBusiness : BaseBusiness, IShipmentBusiness
    {
        private static readonly log4net.ILog _logger = log4net.LogManager.GetLogger(Assembly.GetEntryAssembly(), "api");

        private IPathProvider _pathProvider;
        private readonly AppSettings _appSettings;
        private readonly IDynamicDataService _dynamicDataService;
        private readonly IOrderDataEntryService _orderDataEntryService;

        public ShipmentBusiness(IHttpContextAccessor context, IPathProvider pathProvider, IOptions<AppSettings> appSettings,
                IOrderDataEntryService orderDataEntryService,  IDynamicDataService dynamicDataService) : base(context)
        {
            _pathProvider = pathProvider;
            _appSettings = appSettings.Value;
            _dynamicDataService = dynamicDataService;
            _orderDataEntryService = orderDataEntryService;
        }

        public async Task<ColissimoResponseModel> ProcessRequestShipment(string idSaleOrder, Dictionary<string, object>  datax)
        {
            /**
            //1. get order detail
            //2. Mapping data of Order to model request to Colissimo
            //3. post request to Colissimo
            //4. received result and check
            //  4.1 save attachment
            //  4.2 submit path of attachment to DB
            //  4.3 get process shipment id and submit to DB
            //  shipment id: replace all space before submit to DB
            //5 return result to Client
            **/
            _logger.Debug("init submit data to Colissimo WS of IdSalesOrder:" + idSaleOrder);
            ColissimoResponseModel response = new ColissimoResponseModel();
            try
            {
                var orderDetail = await GetOrderDetails(idSaleOrder);// "1373848");

                ShipmentOrderModel orderInfo = JsonConvert.DeserializeObject<ShipmentOrderModel>((((JArray)orderDetail)[0][0]).ToString());
                List<ShipmentArticleModel> articles = JsonConvert.DeserializeObject<List<ShipmentArticleModel>>((((JArray)orderDetail)[1]).ToString());
                ShipmentSenderModel senderAddress = JsonConvert.DeserializeObject<ShipmentSenderModel>((((JArray)orderDetail)[2][0]).ToString());
                ShipmentReceiverModel receiverAddress = JsonConvert.DeserializeObject<ShipmentReceiverModel>((((JArray)orderDetail)[3][0]).ToString());

                ////"{\r\n  \"OrderNr\": \"202081000088\",\r\n  \"RefDecommand\": \"0811VCTC11-000021-4-202081000088\",\r\n  \"TagUtili\": \"\",\r\n  \"PoidsKg\": 0.158,\r\n  \"EnCasDeNonLivrasion\": \"Ne pas me retourner le colis\",\r\n  \"DimDuColis\": \"8,10,12\"\r\n}"    string
                ShipmentColissimoModel data = TransformData(orderInfo, articles, senderAddress, receiverAddress);

                if (string.IsNullOrEmpty(_appSettings.ColissimoConfig.ContractNumber) || string.IsNullOrEmpty(_appSettings.ColissimoConfig.Key))
                {
                    _logger.Debug("Stop Colissimo - IdSaleOrder:" + idSaleOrder + " \r\n (unknow acc)  \r\n CallAPIGenerateLabel:" + JsonConvert.SerializeObject(data));
                    return response;
                }
                response = await CallAPIGenerateLabel(idSaleOrder + "",
                        JsonConvert.DeserializeObject<ShipmentColissimoModel>(JsonConvert.SerializeObject(data)));

                if (response == null) response = new ColissimoResponseModel();
                if (response.Messages != null && response.Messages.Count > 0)
                {
                    response.Message = response.Messages.First();
                    response.Messages = null;
                }

                _logger.Debug("Result submit data to Colissimo WS of IdSalesOrder:" + idSaleOrder + " \r\n result: " + JsonConvert.SerializeObject(response));

                if (response.PDFFiles != null && response.PDFFiles.Count > 0)
                {
                    List<SaleOrderFilesModel> orderFiles = new List<SaleOrderFilesModel>();
                    for(int posPdf = 0; posPdf < response.PDFFiles.Count; posPdf++)
                    {
                        SaleOrderFilesModel pdf = new SaleOrderFilesModel();
                        pdf.FileName = Path.GetFileName(response.PDFFiles.ElementAt(posPdf));
                        pdf.MediaPath = response.PDFFiles.ElementAt(posPdf);//.Replace(_pathProvider.FileShare + "\\", "");
                        orderFiles.Add(pdf);
                    }                   

                    var _colOrderPaymentsJSON = JsonConvert.SerializeObject(orderFiles,
                                            Newtonsoft.Json.Formatting.None,
                                            new JsonSerializerSettings
                                            {
                                                NullValueHandling = NullValueHandling.Ignore
                                            });
                    SaveResponseFromColissimoData dataSaveFile = (SaveResponseFromColissimoData)ServiceDataRequest.ConvertToRelatedType(typeof(SaveResponseFromColissimoData));

                    dataSaveFile.IdSalesOrder = idSaleOrder;
                    dataSaveFile.PackageNr = response.LabelV2Response.ParcelNumber;
                    dataSaveFile.JSONText = string.Format(@"""SalesOrderFiles"":{0}", _colOrderPaymentsJSON);
                    dataSaveFile.JSONText = "{" + dataSaveFile.JSONText + "}";

                    await _orderDataEntryService.SaveOrderFileFromColissimo(dataSaveFile);
                }

            } catch(Exception err)
            {
                _logger.Error("ProcessRequestShipment - IdSaleOrder:" + idSaleOrder, err);
                if (response.Message == null)
                {
                    response.Message = new ColissimoMessageResponseModel();
                    response.Message.Id = "-1";
                    response.Message.Type = "ERROR";
                    response.Message.MessageContent = err.Message;
                }
            }
            return response;
        }

        private async Task<object> GetOrderDetails(string orderId)
        {
            Dictionary<string, object> values = new Dictionary<string, object>();

            Data baseData = (Data)ServiceDataRequest.ConvertToRelatedType(typeof(Data));
            DynamicData saveData = new DynamicData
            {
                Data = baseData
            };
            values["MethodName"]    = "SpCallOrderDataEntry";
            values["Object"]        = "GetDataForColissimo";
            values["IdSalesOrder"]  =  orderId;
            values["AppModus"]      = "0";

            saveData.AddParams(values);
            return await _dynamicDataService.GetData(saveData, returnType: Constants.EDynamicDataGetReturnType.None);
        }

        public async Task<ColissimoResponseModel> CallAPIGenerateLabel(string IdSaleOrder, ShipmentColissimoModel data)
        {
            ColissimoResponseModel rsModel = new ColissimoResponseModel();
            rsModel.PDFFiles = new List<string>();
            try
            {
                _logger.Debug("Colissimo - IdSaleOrder:" + IdSaleOrder + "  \r\n CallAPIGenerateLabel:" + JsonConvert.SerializeObject(data));
                data.contractNumber = _appSettings.ColissimoConfig.ContractNumber;
                data.password = _appSettings.ColissimoConfig.Key;

                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(_appSettings.ColissimoConfig.URLGenerateLabel);
                request.Method = "POST";
                byte[] bArray = Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(data));
                request.ContentType = "application/json; charset=utf-8";
                request.ContentLength = bArray.Length;
                Stream webData = request.GetRequestStream();
                webData.Write(bArray, 0, bArray.Length);
                webData.Close();

                var response = request.GetResponse();

                using (Stream stream = response.GetResponseStream())
                {
                    byte[] byteEOF = Encoding.UTF8.GetBytes("%%EOF");
                    byte[] bytes = null;
                    using (MemoryStream ms = new MemoryStream())
                    {
                        int count = 0;
                        do
                        {
                            byte[] buf = new byte[1024];
                            count = stream.Read(buf, 0, 1024);
                            ms.Write(buf, 0, count);
                        } while (stream.CanRead && count > 0);
                        bytes = ms.ToArray();
                    }
                    string text = Encoding.UTF8.GetString(bytes);
                    if (string.IsNullOrEmpty(text))
                    {
                        stream.Close();
                        _logger.Error("Colissimo - IdSaleOrder:" + IdSaleOrder + "  \r\n content response EMPTY");
                        return rsModel;
                    }
                    string temp = "";
                    if (text.IndexOf("{\"messages") > -1)
                    {
                        temp = text.Substring(text.IndexOf("{\"messages"));
                        if (temp.IndexOf("}}") > -1)
                        {
                            temp = temp.Substring(0, temp.IndexOf("}}") + 3);
                            try
                            {
                                rsModel = JsonConvert.DeserializeObject<ColissimoResponseModel>(temp);
                                rsModel.PDFFiles = new List<string>();
                            }
                            catch (Exception ec)
                            {
                                _logger.Error("Colissimo - IdSaleOrder:" + IdSaleOrder + "  \r\n error convert string to ColissimoResponseModel :" + temp, ec);
                            }
                        }                        
                    }
                    if (string.IsNullOrEmpty(temp)) {
                        _logger.Error("Colissimo - IdSaleOrder:" + IdSaleOrder + "  \r\n cannot convert string to ColissimoResponseModel :" + temp);
                    }

                    #region write response to file
                    string responseFile = MakePathStoragePDFFile(IdSaleOrder + "_" + "response") ;
                    File.WriteAllBytes(responseFile, bytes);
                    #endregion

                    #region write PDF files
                    try
                    {
                        int pos = IndexPatternInArray(bytes, byteEOF);
                        while (pos > -1)
                        {
                            byte[] newArray = new byte[pos + 1];
                            Array.Copy(bytes, 0, newArray, 0, pos);

                            string pdfFileN = MakePathStoragePDFFile(IdSaleOrder);
                            File.WriteAllBytes(pdfFileN, newArray);
                            rsModel.PDFFiles.Add(pdfFileN.Replace(_pathProvider.FileShare + "\\", ""));

                            if ((pos + byteEOF.Length) >= bytes.Length)
                            {
                                pos = -1;
                                break;
                            }
                            Array.Clear(newArray, 0, newArray.Length);
                            newArray = new byte[bytes.Length - pos + 10];
                            Array.Copy(bytes, (pos + byteEOF.Length + 1), newArray, 0, bytes.Length - (pos + byteEOF.Length + 1));
                            pos = IndexPatternInArray(newArray, byteEOF);
                            Array.Clear(bytes, 0, bytes.Length);
                            bytes = newArray;
                        }
                    } catch(Exception ex)
                    {
                        _logger.Error("Colissimo - IdSaleOrder:" + IdSaleOrder + "   error generate PDF files", ex);
                    }                    
                    #endregion write PDF files
                    stream.Close();
                    if (rsModel.PDFFiles.Count == 0)
                    {
                        rsModel.PDFFiles.Add(responseFile);
                    }
                }               
            } catch (WebException e)
            {
                using (WebResponse response = e.Response)
                {
                    HttpWebResponse httpResponse = (HttpWebResponse)response;
                    Console.WriteLine("Error code: {0}", httpResponse.StatusCode);
                    _logger.Error("Colissimo StatusCode:" + httpResponse.StatusCode + "     - IdSaleOrder:" + IdSaleOrder);
                    using (Stream stream = response.GetResponseStream())
                    {
                        string contentError = new StreamReader(stream).ReadToEnd();
                        _logger.Error("Colissimo - IdSaleOrder:" + IdSaleOrder + " \r\n error: " + contentError);
                        if (contentError.IndexOf("[{") > -1)
                        {
                            string temp = contentError.Substring(contentError.IndexOf("[{") + 1);
                            temp = temp.Substring(0, temp.IndexOf("}]") + 1);
                            ColissimoMessageResponseModel msg = JsonConvert.DeserializeObject<ColissimoMessageResponseModel>(temp);                            
                            rsModel.Messages = new List<ColissimoMessageResponseModel>();
                            rsModel.Messages.Add(msg);
                        }
                    }
                }
            }
            catch(Exception e)
            {
                _logger.Error("Colissimo - IdSaleOrder:" + IdSaleOrder + "  \r\n data:" + JsonConvert.SerializeObject(data), e);
                if (rsModel.Message == null)
                {
                    rsModel.Message = new ColissimoMessageResponseModel();
                    rsModel.Message.Id = "-1";
                    rsModel.Message.Type = "ERROR";
                    rsModel.Message.MessageContent = e.Message;
                }
            }
            return rsModel;
        }


        private bool CheckPatternInArray(byte[] array, byte[] pattern)
        {
            int fidx = 0;
            int result = Array.FindIndex(array, 0, array.Length, (byte b) =>
            {
                fidx = (b == pattern[fidx]) ? fidx + 1 : 0;
                return (fidx == pattern.Length);
            });
            return (result >= pattern.Length - 1);
        }

        private int IndexPatternInArray(byte[] array, byte[] pattern)
        {
            int fidx = 0;
            int result = Array.FindIndex(array, 0, array.Length, (byte b) =>
            {
                fidx = (b == pattern[fidx]) ? fidx + 1 : 0;
                return (fidx == pattern.Length);
            });
            return result;
        }

        private void TestSplitPDFs()
        {
            byte[] bytes = Encoding.UTF8.GetBytes("%%EOF");

            string text = "{\"messages\":[{\"id\":\"0\",\"type\":\"INFOS\",\"messageContent\":\"La requête a été traitée avec succès\",\"replacementValues\":[]}],\"labelXmlV2Reponse\":null,\"labelV2Response\":{\"parcelNumber\":\"CB699462444FR\",\"parcelNumberPartner\":\"996010984469946244\",\"pdfUrl\":null,\"fields\":{\"field\":[{\"key\":\"NETWORK_NAME\",\"value\":\"EPG\"},{\"key\":\"PARTNER_NAME\",\"value\":\"Swiss Post\"},{\"key\":\"PARTNER_CAB\",\"value\":\"996010984469946244\"},{\"key\":\"CN23_THERMIQUE\",\"value\":\"N\"}],\"customField\":[{\"key\":\"NETWORK_NAME\",\"value\":\"EPG\"},{\"key\":\"PARTNER_NAME\",\"value\":\"Swiss Post\"},{\"key\":\"PARTNER_CAB\",\"value\":\"996010984469946244\"},{\"key\":\"CN23_THERMIQUE\",\"value\":\"N\"}]}}}";
            //text = File.ReadAllText("E:\\Projects\\Xena\\Colissimo\\response-CH-address.pdf", Encoding.UTF8);
            byte[] texts = File.ReadAllBytes("E:\\Projects\\Xena\\Colissimo\\ch-address.pdf");
            //bool a = CheckPatternInArray(texts, bytes);
            int pos = IndexPatternInArray(texts, bytes);
            while (pos > -1)
            {
                byte[] newArray = new byte[pos + 1];
                Array.Copy(texts, 0, newArray, 0, (pos));

                string pdfFileN = MakePathStoragePDFFile("123");
                File.WriteAllBytes(pdfFileN, newArray);

                if ((pos + bytes.Length) >= texts.Length)
                {
                    pos = -1;
                    break;
                }
                Array.Clear(newArray, 0, newArray.Length);
                newArray = new byte[texts.Length - pos + 10];
                Array.Copy(texts, (pos + bytes.Length + 1), newArray, 0, texts.Length - (pos + bytes.Length + 1));
                pos = IndexPatternInArray(newArray, bytes);
                Array.Clear(texts, 0, texts.Length);
                texts = newArray;
            }


            string temp = text.Substring(text.IndexOf("{\"messages"));
            temp = temp.Substring(0, temp.IndexOf("}}") + 3);
            ColissimoResponseModel rsModel = JsonConvert.DeserializeObject<ColissimoResponseModel>(temp);
            rsModel.PDFFiles = new List<string>();
            string[] arrayContentFiles = text.Split("%%EOF");
            for (int ar = 0; ar < arrayContentFiles.Length - 1; ar++)
            {
                string tmp = arrayContentFiles[ar] + "\r\n" + "%%EOF";
                string pdfFileN = MakePathStoragePDFFile("123");
                File.WriteAllText(pdfFileN, tmp);
                rsModel.PDFFiles.Add(pdfFileN);
            }
        }


        private string MakePathStoragePDFFile(string idSaleOrder)
        {
            string subPath = Path.Combine(DateTime.Now.ToString("yyyy"), Path.Combine(DateTime.Now.ToString("MM"), DateTime.Now.ToString("dd")));
            subPath = Path.Combine(_appSettings.ColissimoConfig.UploadFolder, subPath);
            string folderStorage  = Path.Combine(_pathProvider.FileShare, subPath);
            if (!Directory.Exists(folderStorage))
                Directory.CreateDirectory(folderStorage);
            string pathPDF = Path.Combine(folderStorage, (idSaleOrder + "_" + DateTime.Now.ToString("HHmmsss") + ".pdf"));
            return pathPDF;
        }
         
        private ShipmentColissimoModel TransformData(ShipmentOrderModel orderIno, List<ShipmentArticleModel> articles,
                        ShipmentSenderModel senderAddress, ShipmentReceiverModel receiverAddress)
        {
            ShipmentColissimoModel dataSubmit = new ShipmentColissimoModel();

            dataSubmit.outputFormat = new ColissimoOuputFormatModel();
            dataSubmit.outputFormat.x = 0;
            dataSubmit.outputFormat.y = 0;
            dataSubmit.outputFormat.outputPrintingType = "PDF_A4_300dpi";

            dataSubmit.letter = new ColissimoLetterModel();

            ColissimoLetterModel letter = new ColissimoLetterModel();
            letter.service = new ColissimoServiceModel();
            if (senderAddress.HasSignature == 1)
            {
                letter.service.productCode = "DOS";
            } else
            {
                letter.service.productCode = "DOM";
            }            
            letter.service.depositDate = DateTime.Now.ToString("yyyy-MM-dd");
            letter.service.orderNumber = orderIno.OrderNr;
            if (!string.IsNullOrEmpty(orderIno.TotalAmount)) {
                try
                {
                    string tmp = orderIno.TotalAmount;
                    if (tmp.Contains(",")) tmp = tmp.Replace(",", ".");
                    letter.service.totalAmount = double.Parse(tmp);
                } catch (Exception eConvert)
                {
                    _logger.Debug("error convert TotalAmount from orderIno: " + JsonConvert.SerializeObject(orderIno), eConvert);
                }
            }
            
            letter.service.returnTypeChoice = 3;

            ColissimoParcelModel parcel = new ColissimoParcelModel();
            parcel.weight = orderIno.PoidsKg;
            letter.parcel = parcel;

            ColissimoCustomsDeclarationsModel customsDeclarations = new ColissimoCustomsDeclarationsModel();
            customsDeclarations.includeCustomsDeclarations = senderAddress.HasCustomerDeclaration;
            customsDeclarations.contents = new ColissimoContentsModel();

            customsDeclarations.contents.article = new List<ColissimoArticleModel>();

            for(int ar = 0; ar < articles.Count(); ar++)
            {
                ColissimoArticleModel a = new ColissimoArticleModel();
                a.artref = articles.ElementAt(ar).Artref;
                a.currency = "EUR";
                a.customsFees = articles.ElementAt(ar).CustomerFees;
                a.description = articles.ElementAt(ar).Description;
                a.hsCode        = articles.ElementAt(ar).HsCode;
                a.originalIdent = articles.ElementAt(ar).OriginalIdent;
                a.originCountry = articles.ElementAt(ar).OriginCountry;
                a.quantity      = articles.ElementAt(ar).Quantity;
                a.value         = articles.ElementAt(ar).Value;
                a.vatAmount     = 0;
                a.weight = articles.ElementAt(ar).Weight;

                customsDeclarations.contents.article.Add(a);
            }

            customsDeclarations.contents.category = new ColissimoCategoryModel();
            customsDeclarations.contents.category.value = 1;

            letter.customsDeclarations = customsDeclarations;


            ColissimoSenderModel sender = new ColissimoSenderModel();
            sender.senderParcelRef = senderAddress.CompanyName;
            sender.address = new ColissimoAddressModel();
            sender.address.city = senderAddress.City;
            sender.address.companyName = senderAddress.CompanyName;
            sender.address.countryCode = senderAddress.CountryCode;
            sender.address.email = senderAddress.Email;
            sender.address.line1 = senderAddress.Line1;
            sender.address.line2 = senderAddress.Line2;
            sender.address.zipCode = senderAddress.ZipCode;
            

            ColissimoReceiverModel addressee = new ColissimoReceiverModel();
            addressee.addresseeParcelRef = "";
            addressee.codeBarForReference = true;
            addressee.address = new ColissimoAddressModel();
            addressee.address.city = receiverAddress.City;
            addressee.address.lastName = receiverAddress.LastName;
            addressee.address.firstName = receiverAddress.FirstName;
            addressee.address.countryCode = receiverAddress.CountryCode;
            addressee.address.email = receiverAddress.Email;

            addressee.address.line0 = receiverAddress.Line0;
            if (addressee.address.countryCode == "BE" || addressee.address.countryCode == "CH")
            {
                addressee.address.line0 = null;
            }
            addressee.address.line2 = receiverAddress.Line1;
            addressee.address.zipCode = receiverAddress.ZipCode;

            letter.sender = sender;
            letter.addressee = addressee;
            dataSubmit.letter = letter;

            return dataSubmit;
        }                                            
    }
}
