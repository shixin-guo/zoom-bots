
// const inputCode =
//   '{\n    "menu": {\n      "home": "Home"\n    \n    },\n \n    "pages": {\n      "home": {\n        "title": "Home",\n        "count": "count is: {value}",\n        "virtual": "msg from virtual module: {msg}",\n        "inter": "\'shixin\' is testing {xxx}"\n      }\n    \n    }\n  }';

// const inputCodeProps = ConvertUtils.code2Props(
//   inputCode,
//   ConvertUtils.SupportedFileType.JSON,
// );
// // const value = ConvertUtils.getPropsValue(inputCodeProps);

// const outputCode =
//   '\n{"0":"主页","1":"主页","2":"计数为：{value}","3":"虚拟模块发来的消息：{msg}","4":"\'shixin\' 正在测试 {xxx}"}';
// const outputWithRealKey = ConvertUtils.matchRealKeys(
//   inputCodeProps,
//   outputCode,
// );
// console.log(outputWithRealKey);
// const output = ConvertUtils.Props2Code(
//   ConvertUtils.json2Props(outputWithRealKey),
//   ConvertUtils.SupportedFileType.JSON,
// );
// console.log(output);

// {
//   "zh-CN": "\n\n['主页','主页','计数为：{value}','虚拟模块发来的消息：{msg}','shixin正在测试{xxx}']"
// }
