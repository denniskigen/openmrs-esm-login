import React from "react";
import openmrsRootDecorator from "@openmrs/react-root-decorator";
import { defineConfigSchema, validators } from "@openmrs/esm-module-config";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import { BrowserRouter, Route } from "react-router-dom";
import Login from "./login/login.component";
import ChooseLocation from "./choose-location/choose-location.component";
import { getLoginLocations } from "./choose-location/choose-location.resource";

defineConfigSchema("@openmrs/esm-login", {
  chooseLocation: {
    enabled: {
      default: true,
      description:
        "Whether to show a 'Choose Location' screen after login. " +
        "If true, the user will be taken to the loginSuccess URL after they " +
        "choose a location.",
      validators: [validators.isBoolean],
    },
  },
  links: {
    loginSuccess: {
      description: "Where to take the user after they are logged in.",
      url: {
        default: "/home",
      },
      spa: {
        default: true,
      },
    },
  },
  logo: {
    src: {
      default: null,
      description:
        "A path or URL to an image. Defaults to the OpenMRS SVG sprite.",
    },
    alt: {
      default: "Logo",
      description: "Alt text, shown on hover",
    },
  },
});

function Root(props) {
  const [user, setUser] = React.useState(null);
  const [loginLocations, setLoginLocations] = React.useState([]);

  React.useEffect(() => {
    const sub = getLoginLocations().subscribe(
      (locations) => setLoginLocations(locations),
      createErrorHandler()
    );
    return () => sub.unsubscribe();
  }, []);

  return (
    <BrowserRouter basename={window["getOpenmrsSpaBase"]()}>
      <Route
        exact
        path="/login"
        render={(props) => <Login {...props} loginLocations={loginLocations} />}
      />
      <Route
        exact
        path="/login/location"
        render={(props) => (
          <ChooseLocation {...props} loginLocations={loginLocations} />
        )}
      />
    </BrowserRouter>
  );
}
export default openmrsRootDecorator({
  featureName: "login",
  moduleName: "@openmrs/esm-login",
})(Root);
