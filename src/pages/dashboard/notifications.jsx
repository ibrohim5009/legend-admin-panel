import { Card } from "@material-tailwind/react";
import React from "react";

export function Notifications() {
  const [showAlerts, setShowAlerts] = React.useState({
    blue: true,
    green: true,
    orange: true,
    red: true,
  });
  const [showAlertsWithIcon, setShowAlertsWithIcon] = React.useState({
    blue: true,
    green: true,
    orange: true,
    red: true,
  });
  const alerts = ["blue", "green", "orange", "red"];

  return (
    <div className="mx-auto my-20 flex max-w-screen-lg flex-col gap-8">
    salom
    </div>
  );
}

export default Notifications;
