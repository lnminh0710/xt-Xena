using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using XenaUI.Models;
using XenaUI.Utils;

namespace XenaUI.Business
{
    public interface IBaseBusiness
    {
        Data ServiceDataRequest { get;}
        string AccessToken { get;}
        UserFromService UserFromService { get;}

        User GetUserInfoFromToken();

        Task<bool> Execute(Func<Task<bool>> action);
    }
}
