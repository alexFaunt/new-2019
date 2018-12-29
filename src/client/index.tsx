import * as React from "react";
import * as ReactDOM from "react-dom";

import App from "../app"; // TODO absolute paths on app

console.log('client side');
ReactDOM.render(<div>hi<App /></div>, document.getElementById("app"));
