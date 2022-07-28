//using System;
//using System.Dynamic;
//using PostSharp.Aspects;
//using PostSharp.Serialization;

//namespace XenaUI.PostSharp.ExceptionHandling
//{
//    /// <summary>
//    ///   Aspect that, when applied to a method and whenever this method fails with an exception, adds the value of method
//    ///   parameters to the <see cref="Exception" /> object.
//    ///   The <see cref="PostSharpReportAndSwallowExceptionAttribute" /> can consume this information and print it if the exception is
//    ///   not handled.
//    /// </summary>
//    [PSerializable]
//    public sealed class PostSharpAddContextOnExceptionAttribute : OnExceptionAspect
//    {
//        public override void OnException(MethodExecutionArgs args)
//        {
//            var declaringType = args.Method.DeclaringType;

//            dynamic data = new ExpandoObject();
//            var key = declaringType.FullName + "." + args.Method.Name;

//            if (declaringType.IsGenericType)
//            {
//                data.GenericArgumentsType = declaringType.GetGenericArguments();
//            }

//            if (args.Method.IsGenericMethod)
//            {
//                data.GenericArgumentsMethod = args.Method.GetGenericArguments();
//            }

//            data.Arguments = args.Arguments;

//            args.Exception.Data.Add(key, data);
//        }
//    }
//}
