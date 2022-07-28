using MailKit.Security;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using MimeKit;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Net.Mime;
using System.Reflection;
using System.Threading.Tasks;
using XenaUI.Models;
using XenaUI.Utils;

namespace XenaUI.Business
{
    public class EmailBusiness : BaseBusiness, IEmailBusiness
    {
        public static string XeNaLogoCid = "XeNaLogo";
        public string Domain { get; set; }


        private IPathProvider _pathProvider;
        private readonly AppSettings _appSettings;

        public EmailBusiness(IHttpContextAccessor context, IPathProvider pathProvider, IOptions<AppSettings> appSettings) : base(context)
        {
            _pathProvider = pathProvider;
            _appSettings = appSettings.Value;

            Domain = context.HttpContext.Request.Host.ToString();
        }

        /// <summary>
        /// SendEmailAsync
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public async Task<bool> SendEmail(EmailSimpleModel model)
        {
            var emailMessage = new MimeMessage();

            emailMessage.From.Add(new MailboxAddress(
                _appSettings.EmailSending.Email.Split(new string[] { "@" }, StringSplitOptions.None)[0],
                _appSettings.EmailSending.Email));
            emailMessage.To.Add(new MailboxAddress(model.ToEmail.Split(new string[] { "@" }, StringSplitOptions.None)[0], model.ToEmail));
            emailMessage.Subject = model.Subject;
            emailMessage.Body = new TextPart(_appSettings.EmailSending.ContentType) { Text = model.Body };

            using (var client = new MailKit.Net.Smtp.SmtpClient())
            {
                client.Connect(_appSettings.EmailSending.Domain, _appSettings.EmailSending.Port, SecureSocketOptions.StartTlsWhenAvailable);
                client.AuthenticationMechanisms.Remove("XOAUTH2"); // Must be removed for Gmail SMTP
                client.Authenticate(_appSettings.EmailSending.Email, _appSettings.EmailSending.Password);
                client.Send(emailMessage);
                client.Disconnect(true);
            }
            return await Task.FromResult(true);
        }

        /// <summary>
        /// SendEmailWithEmbeddedImage
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public async Task<bool> SendEmailWithEmbeddedImage(EmailModel model)
        {
            System.Net.Mail.SmtpClient client = new System.Net.Mail.SmtpClient(_appSettings.EmailSending.Domain, _appSettings.EmailSending.Port)
            {
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(_appSettings.EmailSending.Email, _appSettings.EmailSending.Password),
                EnableSsl = true
            };

            MailMessage mailMessage = new MailMessage(
                    _appSettings.EmailSending.Email,
                    model.ToEmail,
                    model.Subject,
                    "");

            #region AlternateView: Embed Resources
            System.Net.Mime.ContentType mimeType = new System.Net.Mime.ContentType("text/html");
            AlternateView alternateView = AlternateView.CreateAlternateViewFromString(model.Body, mimeType);

            foreach (var item in model.ImageAttached)
            {
                byte[] bitmapData = Convert.FromBase64String(FixBase64ForImage(item.Source.Split(',')[1]));
                MemoryStream streamBitmap = new MemoryStream(bitmapData);

                var imageToInline = new LinkedResource(streamBitmap, MediaTypeNames.Image.Jpeg)
                {
                    ContentId = item.EmbeddedId
                };
                // Add the alternate body to the message.
                alternateView.LinkedResources.Add(imageToInline);
            }

            mailMessage.AlternateViews.Add(alternateView);
            #endregion

            #region Attachments
            MailMessageAttachment(mailMessage, model.Attachments);
            #endregion

            client.Send(mailMessage);

            return await Task.FromResult(true);
        }

        #region SendNotificationEmail

        /// <summary>
        /// SendNotificationEmail
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public async Task<bool> SendNotificationEmail(EmailModel model)
        {
            IList<MemoryStream> streamBitmaps = new List<MemoryStream>();
            string body = InitImageTableHeader();
            body += CombineImageBodyHeader(model);
            string borderColor = "#3c8dbc";
            foreach (var item in model.ImageAttached.Select((value, i) => new { i, value }))
            {
                byte[] bitmapData = Convert.FromBase64String(FixBase64ForImage(item.value.Source.Split(',')[1]));
                MemoryStream streamBitmap = new MemoryStream(bitmapData);
                streamBitmaps.Add(streamBitmap);

                using (var ms = new MemoryStream(bitmapData))
                {
                    Image img = Image.FromStream(ms);
                    string size = (img.Width >= 1024) ? "100%" : "auto";
                    body += CombineImageBody(item, borderColor,
                            (item.i < model.ImageAttached.Count - 1),
                            size);
                }
            }
            body += "</tbody></table></td></tr></tbody></table></td></tr></table>";

            SendAttachImageEmail(model, streamBitmaps, body);

            return await Task.FromResult(true);
        }

        private void SendAttachImageEmail(EmailModel model, IList<MemoryStream> streamBitmaps, string body)
        {
            System.Net.Mail.SmtpClient client = new System.Net.Mail.SmtpClient(_appSettings.EmailSending.Domain, _appSettings.EmailSending.Port)
            {
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(_appSettings.EmailSending.Email, _appSettings.EmailSending.Password),
                EnableSsl = true
            };

            MailMessage mailMessage = new MailMessage(
                    _appSettings.EmailSending.Email,
                    model.ToEmail + "," + UserFromService.Email,
                    model.Subject,
                    "");

            #region #region AlternateView: Embed Resources

            System.Net.Mime.ContentType mimeType = new System.Net.Mime.ContentType("text/html");
            AlternateView alternateView = AlternateView.CreateAlternateViewFromString(body, mimeType);

            #region [Add Logo]
            byte[] bitmapData = Convert.FromBase64String(FixBase64ForImage(ImageToBase64(_appSettings.ImageLogoUrl).Split(',')[1]));
            MemoryStream streamBitmap = new MemoryStream(bitmapData);

            var logoToInline = new LinkedResource(streamBitmap, MediaTypeNames.Image.Jpeg)
            {
                ContentId = XeNaLogoCid
            };
            alternateView.LinkedResources.Add(logoToInline);
            #endregion

            #region [Add All Image]
            foreach (var item in streamBitmaps.Select((value, i) => new { i, value }))
            {
                var imageToInline = new LinkedResource(item.value, MediaTypeNames.Image.Jpeg)
                {
                    ContentId = "MyImage" + item.i.ToString()
                };
                alternateView.LinkedResources.Add(imageToInline);
            }

            mailMessage.AlternateViews.Add(alternateView);
            #endregion

            #endregion

            #region Attachments
            MailMessageAttachment(mailMessage, model.Attachments);
            #endregion

            client.Send(mailMessage);
        }

        private void MailMessageAttachment(MailMessage mailMessage, IList<EmailAttachmentFile> attachments)
        {
            if (attachments == null || attachments.Count == 0) return;

            foreach (var attachmentFile in attachments)
            {
                FileInfo fileInfo = new FileInfo(attachmentFile.FullName);
                if (!fileInfo.Exists) continue;

                Attachment attachment = new Attachment(fileInfo.FullName, MediaTypeNames.Application.Octet);
                System.Net.Mime.ContentDisposition disposition = attachment.ContentDisposition;
                disposition.CreationDate = fileInfo.CreationTime;
                disposition.ModificationDate = fileInfo.LastWriteTime;
                disposition.ReadDate = fileInfo.LastAccessTime;
                disposition.FileName = attachmentFile.DisplayName;
                disposition.Size = fileInfo.Length;
                disposition.DispositionType = DispositionTypeNames.Attachment;
                mailMessage.Attachments.Add(attachment);
            }//for
        }

        private string InitImageTableHeader()
        {
            return string.Format(@"
                    <meta http-equiv='content-type' content='text/html; charset=UTF-8'>
                    <table style='width:1200px;
                            border: 1px solid #0b6599;
                            line-height: 16px;
                            font-size: 14px;
                            font-family: tahoma;'>
                        <tr><td style='width:1200px;
                                height:50px;
                                background-color:#0b6599'
                                height='50px'>
                            <img style='width:130px;height:50px' height='50px' width='130px' src='cid:{0}'/>
                        </td></tr>
                        <tr><td style='padding:10px 40px 20px 40px; width:1200px;'>
                            <table align='center'
                                border='0'
                                cellpadding='0'
                                cellspacing='0'
                                dir='ltr'
                                style='font-size:16px;width:1024px;'
                                width='1024px'>
                                <tbody>
                                    <tr>
                                        <td align='center' style='margin:0;padding:0 0 79px; width:1024px;' valign='top'>
                                            <table align='center' border='0' cellpadding='0' cellspacing='0' style='width:1024px;' width='1024'>
                                                <tbody>", XeNaLogoCid);
        }
        private string CombineImageBodyHeader(EmailModel model)
        {
            var descriptions = new List<Tuple<string, string>> {
                new Tuple<string, string>("Database Name", model.DatabaseName),
                new Tuple<string, string>("Priority", model.Priority),
                new Tuple<string, string>("Report From", UserFromService.FullName),
                new Tuple<string, string>("Email", UserFromService.Email)
            };
            foreach (PropertyInfo propertyInfo in model.BrowserInfo.GetType().GetProperties())
            {
                var value = propertyInfo.GetValue(model.BrowserInfo);
                if (value == null || string.IsNullOrEmpty(value.ToString())) continue;
                var attribute = (DescriptionAttribute)propertyInfo.GetCustomAttribute(typeof(DescriptionAttribute));
                descriptions.Add(new Tuple<string, string>(attribute.Description, value.ToString()));
            }

            var result = CreateDescriptionLine(descriptions);

            if (!string.IsNullOrEmpty(model.Body))
            {
                result += string.Format(@"
                <tr>
                    <td style='padding:5px; width:1024px; margin:0px;' width='1024px' valign='top'>
                        <span>Description:</span>
                        <p style='font-weight:900;'>{0}</p>
                    </td>
                </tr>
            ", model.Body);
            }
            result += @"
                <tr>
                    <td style='padding:5px; width:1024px; margin:0px; height:20px;' width='1024px' valign='top'></td>
                </tr>";

            return result;
        }

        private string CreateDescriptionLine(IList<Tuple<string, string>> descriptions)
        {
            string result = @"<tr>
                    <td style='padding:5px; width:1024px; margin:0px;' width='1024px' valign='top'>
                        <table width='100%' style='width:100%;border-right: 1px solid #d3cfcf; border-bottom: 1px solid #d3cfcf;' cellspacing='0' cellpadding='5'>";
            foreach (var item in descriptions)
            {
                result += string.Format(@"
                            <tr>
                                <td style='border-left: 1px solid #d3cfcf; border-top: 1px solid #d3cfcf; width: 30%'>
                                    {0}
                                </td>
                                <td style='border-left: 1px solid #d3cfcf; border-top: 1px solid #d3cfcf;'>
                                    <span style='font-weight:900'>{1}</span>
                                </td>
                            </tr>", item.Item1, item.Item2);
            }
            result += "</table></td></tr>";
            return result;
        }

        private string CombineImageBody(dynamic item, string borderColor, bool isAddSeparate, string size)
        {
            var result = string.Format(@"
                <tr>
                    <td align='center' style='padding:5px;
                                        width:1024px;
                                        margin:0px;
                                        border:1px solid {0};
                                        border-bottom-color:{1};'
                                    width='1024px' valign='top'>
                        <img style='width:{2}' width='{2}' src='cid:MyImage{3}'/>
                    </td>
                </tr>
                
            ", borderColor,
            (!string.IsNullOrEmpty(item.value.Text)) ? "#d8d8d8" : borderColor,
            size, item.i);

            if (!string.IsNullOrEmpty(item.value.Text))
            {
                result += string.Format(@"<tr>
                    <td style='padding:5px; width:1024px; margin:0px; border:1px solid {1}; border-top:none;' width='1024px' valign='top'>
                        <p>{0}</p>
                    </td>
                </tr>", item.value.Text, borderColor);
            }

            result += isAddSeparate ? @"<tr>
                    <td align='center' style='padding:5px; width:1024px; margin:0px; height:20px;' width='1024px' valign='top'></td>
                </tr>" : "";
            return result;
        }
        #endregion

        public string FixBase64ForImage(string Image)
        {
            System.Text.StringBuilder sbText = new System.Text.StringBuilder(Image, Image.Length);
            sbText.Replace("\r\n", string.Empty); sbText.Replace(" ", string.Empty);
            return sbText.ToString();
        }

        public string ImageToBase64(string imagePath)
        {
            byte[] b = File.ReadAllBytes(_pathProvider.MapWebRootPath(imagePath));
            return "data:image/png;base64," + Convert.ToBase64String(b);
        }
    }
}
