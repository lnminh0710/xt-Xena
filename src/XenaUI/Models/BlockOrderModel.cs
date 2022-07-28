using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using XenaUI.Models.Property;

namespace XenaUI.Models
{
    /// <summary>
    /// SalesOrderLettersViewModel
    /// </summary>
    public class SalesOrderLettersViewModel
    {
        /// <summary>
        /// BackOfficeLetter
        /// </summary>
        public BackOfficeLettersModel BackOfficeLetter { get; set; }

        /// <summary>
        /// ReasonDataModel
        /// </summary>
        public IList<ReasonDataModel> ReasonData { get; set; }

        /// <summary>
        /// TreeMedia
        /// </summary>
        public IList<SharingTreeMedia> TreeMedia { get; set; }
    }

    /// <summary>
    /// SalesOrderLettersViewModel
    /// </summary>
    public class ConfirmSalesOrderLettersViewModel
    {
        /// <summary>
        /// ConfirmBackOfficeLettersModels
        /// </summary>
        public IList<ConfirmBackOfficeLettersModel> ConfirmBackOfficeLettersModels { get; set; }
    }

    /// <summary>
    /// ConfirmBackOfficeLettersModel
    /// </summary>
    public class ConfirmBackOfficeLettersModel
    {
        /// <summary>
        /// IdSalesOrderLetters
        /// </summary>
        public int? IdSalesOrderLetters { get; set; }
    }

    /// <summary>
    /// BackOfficeLettersModel
    /// </summary>
    public class BackOfficeLettersModel
    {
        /// <summary>
        /// IdSalesOrderLetters
        /// </summary>
        public int? IdSalesOrderLetters { get; set; }

        /// <summary>
        /// IdBackOfficeLetters
        /// </summary>
        public int? IdBackOfficeLetters { get; set; }

        /// <summary>
        /// IdGenerateLetter
        /// </summary>
        public int? IdGenerateLetter { get; set; }

        /// <summary>
        /// IdSalesOrder
        /// </summary>
        public int? IdSalesOrder { get; set; }

        /// <summary>
        /// IdPerson
        /// </summary>
        public int? IdPerson { get; set; }

        /// <summary>
        /// IsSoftDelete
        /// </summary>
        public string IsSoftDelete { get; set; }

        /// <summary>
        /// IsDeleted
        /// </summary>
        public string IsDeleted { get; set; }

        /// <summary>
        /// IsActive
        /// </summary>
        public string IsActive { get; set; }

        /// <summary>
        /// Notes
        /// </summary>
        public string Notes { get; set; }
    }

    public class ReasonDataModel {
        /// <summary>
        /// IdGenerateLetterItems
        /// </summary>
        public int? IdGenerateLetterItems { get; set; }

        /// <summary>
        /// IdBackOfficeLetters
        /// </summary>
        public int? IdBackOfficeLetters { get; set; }

        /// <summary>
        /// IdBackOfficeLettersGroups
        /// </summary>
        public int? IdBackOfficeLettersGroups { get; set; }

        /// <summary>
        /// IdBackOfficeLettersGroupsItems
        /// </summary>
        public int? IdBackOfficeLettersGroupsItems { get; set; }

        /// <summary>
        /// FreeTextLine
        /// </summary>
        public string FreeTextLine { get; set; }

        /// <summary>
        /// IsDeleted
        /// </summary>
        public string IsDeleted { get; set; }
    }

    ////////////////////////////////////////////////////////

    /// <summary>
    /// BackOfficeLettersViewModel
    /// </summary>
    public class BackOfficeLettersViewModel
    {
        /// <summary>
        /// BackOfficeTemplateModel
        /// </summary>
        public BackOfficeTemplateModel BackOfficeTemplate { get; set; }

        /// <summary>
        /// MandantModel
        /// </summary>
        public IList<MandantModel> Mandant { get; set; }

        /// <summary>
        /// CountriesModel
        /// </summary>
        public IList<CountriesModel> Countries { get; set; }

        /// <summary>
        /// AssignWidgetModel
        /// </summary>
        public IList<AssignWidgetModel> AssignWidget { get; set; }

        /// <summary>
        /// GroupsAndItemsModel
        /// </summary>
        public IList<GroupsAndItemsModel> Groups { get; set; }

        /// <summary>
        /// WordDocTemplateModel
        /// </summary>
        public IList<WordDocTemplateModel> DocTemplate { get; set; }
    }


    /// <summary>
    /// BackOfficeTemplateModel
    /// </summary>
    public class BackOfficeTemplateModel
    {
        /// <summary>
        /// LetterName
        /// </summary>
        public string LetterName { get; set; }

        /// <summary>
        /// IsActive
        /// </summary>
        public string IsActive { get; set; }

        /// <summary>
        /// IdBackOfficeLetters
        /// </summary>
        public int? IdBackOfficeLetters { get; set; }

        /// <summary>
        /// IsSoftDelete
        /// </summary>
        public string IsSoftDelete { get; set; }

        /// <summary>
        /// IsDeleted
        /// </summary>
        public string IsDeleted { get; set; }

        /// <summary>
        /// IsAutoGeneratedLetter
        /// </summary>
        public string IsAutoGeneratedLetter { get; set; }

        /// <summary>
        /// IdRepTypeOfAutoLetter
        /// </summary>
        public string IdRepTypeOfAutoLetter { get; set; }
    }

    public class MandantModel
    {
        /// <summary>
        /// IdPerson
        /// </summary>
        public int? IdPerson { get; set; }

        /// <summary>
        /// IsSelected
        /// </summary>
        public int? IsSelected { get; set; }
    }

    public class CountriesModel
    {
        /// <summary>
        /// IdBackOfficeLettersCountries
        /// </summary>
        public int? IdBackOfficeLettersCountries { get; set; }

        /// <summary>
        /// IdCountrylanguage
        /// </summary>
        public int? IdCountrylanguage { get; set; }

        /// <summary>
        /// IsSelected
        /// </summary>
        public int? IsSelected { get; set; }
    }

    public class AssignWidgetModel
    {
        /// <summary>
        /// IdBackOfficeLettersAssignWidget
        /// </summary>
        public int? IdBackOfficeLettersAssignWidget { get; set; }

        /// <summary>
        /// IdBackOfficeLettersAssignWidgetRep
        /// </summary>
        public int? IdBackOfficeLettersAssignWidgetRep { get; set; }

        /// <summary>
        /// IsSelected
        /// </summary>
        public int? IsSelected { get; set; }
    }

    public class GroupsAndItemsModel
    {
        /// <summary>
        /// GroupName
        /// </summary>
        public string GroupName { get; set; }

        /// <summary>
        /// PlaceHolderName
        /// </summary>
        public string PlaceHolderName { get; set; }

        /// <summary>
        /// IsSoftDelete
        /// </summary>
        public int? IsSoftDelete { get; set; }

        /// <summary>
        /// GroupOrderBy
        /// </summary>
        public string GroupOrderBy { get; set; }

        /// <summary>
        /// IdBackOfficeLettersGroups
        /// </summary>
        public string IdBackOfficeLettersGroups { get; set; }

        /// <summary>
        /// GroupItems
        /// </summary>
        public IList<GroupItemsModel> JSONGroupItems { get; set; }
    }
    public class GroupItemsModel
    {
        /// <summary>
        /// IdBackOfficeLettersGroupsItems
        /// </summary>
        public string IdBackOfficeLettersGroupsItems { get; set; }

        /// <summary>
        /// GroupItemName
        /// </summary>
        public string GroupItemName { get; set; }

        /// <summary>
        /// TypeOfChoice
        /// </summary>
        public int TypeOfChoice { get; set; }

        /// <summary>
        /// IsActive
        /// </summary>
        public string IsActive { get; set; }

         /// <summary>
         /// IsSoftDelete
         /// </summary>
         public int? IsSoftDelete { get; set; }

        /// <summary>
        /// ItemOrderBy
        /// </summary>
        public string ItemOrderBy { get; set; }
    }

    public class WordDocTemplateModel
    {
        /// <summary>
        /// IdBackOfficeLettersDocTemplate
        /// </summary>
        public int? IdBackOfficeLettersDocTemplate { get; set; }

        /// <summary>
        /// MediaName
        /// </summary>
        public string MediaName { get; set; }

        /// <summary>
        /// MediaRelativePath
        /// </summary>
        public string MediaRelativePath { get; set; }

        /// <summary>
        /// IsActive
        /// </summary>
        public int? IsActive { get; set; }

        /// <summary>
        /// IsDeleted
        /// </summary>
        public int? IsDeleted { get; set; }

        /// <summary>
        /// IsSoftDelete
        /// </summary>
        public int? IsSoftDelete { get; set; }

        /// <summary>
        /// JSONTreeMedia
        /// </summary>
        public JSONTreeMedia JSONTreeMedia { get; set; }
    }

    public class JSONTreeMedia {
        /// <summary>
        /// TreeMedia
        /// </summary>
        public IList<SharingTreeMedia> TreeMedia { get; set; }
    }

    public class BackOfficeLettersTestViewModel
    {
        /// <summary>
        /// BackOfficeLettersTest
        /// </summary>
        public BackOfficeLettersTestModel BackOfficeLettersTest { get; set; }

        /// <summary>
        /// SharingTreeMedia
        /// </summary>
        public IList<LettersTestModel> LettersTest { get; set; }
    }

    public class BackOfficeLettersTestModel
    {
        /// <summary>
        /// IdBackOfficeLetters
        /// </summary>
        public int? IdBackOfficeLetters { get; set; }
    }

    public class LettersTestModel
    {
        /// <summary>
        /// IdBackOfficeLetters
        /// </summary>
        public int? IdBackOfficeLetters { get; set; }

        /// <summary>
        /// IdBackOfficeLettersGroupsItems
        /// </summary>
        public int? IdBackOfficeLettersGroupsItems { get; set; }
    }
}
