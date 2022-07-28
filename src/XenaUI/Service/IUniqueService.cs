using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using XenaUI.Models;
using XenaUI.Utils;

namespace XenaUI.Service
{
    /// <summary>
    /// IUniqueService
    /// </summary>
    public interface IUniqueService
    {
        /// <summary>
        /// GetMainLanguages
        /// </summary>
        /// <returns></returns>
        Task<object> GetMainLanguages(Data data);

        /// <summary>
        /// GetColumnSetting
        /// </summary>
        /// <param name="moduleId"></param>
        /// <returns></returns>
        Task<object> GetColumnSetting(Data data);

        /// <summary>
        /// GetAllModules
        /// </summary>
        /// <param name="idLogin"></param>
        /// <returns></returns>
        Task<IList<GlobalModule>> GetAllModules(string idLogin);

        /// <summary>
        /// GetAllGlobalModule
        /// </summary>
        /// <param name="idLogin"></param>
        /// <returns></returns>
        Task<IList<GlobalModule>> GetAllGlobalModule(string idLogin);

        /// <summary>
        /// GetDetailSubModule
        /// </summary>
        /// <param name="moduleId"></param>
        /// <returns></returns>
        Task<IList<GlobalModule>> GetDetailSubModule(int moduleId);

        /// <summary>
        /// GetModuleSetting
        /// </summary>
        /// <param name="moduleId"></param>
        /// <returns></returns>
        Task<IList<ModuleSettingModel>> GetModuleSetting(ModuleSettingData data);

        /// <summary>
        /// GetSettingModule
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<object> GetSettingModule(ModuleSettingData data);

        /// <summary>
        /// GetUser
        /// </summary>
        /// <returns></returns>
        Task<UserFromService> GetUser(User user);

        /// <summary>
        /// ResetPassword
        /// </summary>
        /// <param name="loginName"></param>
        /// <returns></returns>
        Task<UserFromService> ResetPassword(string loginName);

        /// <summary>
        /// ChangePassword
        /// </summary>
        /// <param name="loginName"></param>
        /// <param name="newpassword"></param>
        /// <param name="idLogin"></param>
        /// <returns></returns>
        Task<WSReturn> ChangePassword(string loginName, string newpassword, string idLogin);

        /// <summary>
        /// SendNotificationForExpiredUser
        /// </summary>
        /// <param name="loginName"></param>
        /// <param name="content"></param>
        /// <returns></returns>
        Task<bool> SendNotificationForExpiredUser(string loginName, string content);

        /// <summary>
        /// GetTabSummaryInformation
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<IList<TabSummaryModel>> GetTabSummaryInformation(TabData data);

        /// <summary>
        /// GetCustomerColumnsSetting
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<object> GetCustomerColumnsSetting(Data data);

        /// <summary>
        /// GetComboBoxInformation
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<object> GetComboBoxInformation(Data data, string extraData = null);

        /// <summary>
        /// CreateContact
        /// </summary>
        /// <param name="data"></param>
        /// <param name="numCommunications"></param>
        /// <returns></returns>
        Task<WSContactEditReturn> CreateContact(ContactCreateData data, int numCommunications);

        /// <summary>
        /// UpdateContact
        /// </summary>
        /// <param name="data"></param>
        /// <param name="numCommunications"></param>
        /// <returns></returns>
        Task<WSContactEditReturn> UpdateContact(ContactCreateData data, int numCommunications);

        /// <summary>
        /// GetModuleToPersonType
        /// </summary>
        /// <returns></returns>
        Task<IList<ModuleToPersonTypeModel>> GetModuleToPersonType(Data data);

        /// <summary>
        /// UpdateSettingsModule
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<WSReturn> UpdateSettingsModule(UpdateModuleSettingData data);

        /// <summary>
        /// GetDynamicRulesType
        /// </summary>
        /// <returns></returns>
        Task<object> GetDynamicRulesType();

        /// <summary>
        /// GetWidgetAppById
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<object> GetWidgetAppById(WidgetAppGetData data);

        /// <summary>
        /// UpdateWidgetApp
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        Task<WSEditReturn> UpdateWidgetApp(UpdateWidgetAppData data);
    }    
}
