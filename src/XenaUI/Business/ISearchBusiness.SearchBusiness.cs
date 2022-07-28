using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;
using XenaUI.Constants;
using XenaUI.Models;
using XenaUI.Service;
using XenaUI.Utils;

namespace XenaUI.Business
{
    public class SearchBusiness : ISearchBusiness
    {
        private readonly ISearchService _searchService;

        public SearchBusiness(ISearchService searchService)
        {
            this._searchService = searchService;
        }

        public async Task<IList<GlobalModule>> GetAllModules(string accesstoken)
        {
            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadToken(accesstoken) as JwtSecurityToken;
            var userFromService = JsonConvert.DeserializeObject<UserFromService>(jsonToken.Claims.First(c => c.Type == ConstAuth.AppInfoKey).Value);
            ParkedItemData data = new ParkedItemData
            {
                IdLogin = userFromService.IdLogin,
                IdApplicationOwner = userFromService.IdApplicationOwner,
                LoginLanguage = userFromService.Language
            };
            var result = await _searchService.GetAllModules(data);
            return result;
        }

        public async Task<int> SearchSummaryWithKeywork(string accesstoken, string keyword, string moduleId, int pageIndex, int pageSize)
        {
            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadToken(accesstoken) as JwtSecurityToken;
            var userFromService = JsonConvert.DeserializeObject<UserFromService>(jsonToken.Claims.First(c => c.Type == ConstAuth.AppInfoKey).Value);
            SearchData searchData = new SearchData()
            {
                IdLogin = userFromService.IdLogin,
                IdApplicationOwner = userFromService.IdApplicationOwner,
                LoginLanguage = userFromService.Language,
                Keyword = keyword,
                IdSettingsGUI = moduleId,
                PageIndex = pageIndex,
                PageSize = pageSize
            };
            
            var result = await _searchService.SearchSummaryWithKeywork(searchData);
            return result;
        }

        public async Task<CustomerCollection> SearchWithKeywork(string accesstoken, string keyword, string moduleId, int pageIndex, int pageSize)
        {
            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadToken(accesstoken) as JwtSecurityToken;
            var userFromService = JsonConvert.DeserializeObject<UserFromService>(jsonToken.Claims.First(c => c.Type == ConstAuth.AppInfoKey).Value);
            SearchData searchData = new SearchData
            {
                IdLogin = userFromService.IdLogin,
                IdApplicationOwner = userFromService.IdApplicationOwner,
                LoginLanguage = userFromService.Language,
                PageIndex = pageIndex,
                PageSize = pageSize,
                IdSettingsGUI = moduleId,
                Keyword = keyword
            };
            var result = await _searchService.SearchWithKeywork(searchData);
            return result;
        }
    }
}
