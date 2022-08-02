import { Switch } from "antd";
import React, { useEffect } from "react";

export default function ThemeSwitcher(props) {
  const { isCustomFrontend, setIsCustomFrontend } = props;

  useEffect(() => {}, [isCustomFrontend]);

  return (
    <div className="main fade-in" style={{ position: "fixed", right: 150, bottom: 8 }}>
      <span style={{ padding: 8 }}>{isCustomFrontend === true ? "Custom" : "Scaffold"}</span>
      <Switch
        checked={isCustomFrontend}
        onChange={value => {
          setIsCustomFrontend(value);
        }}
      />
    </div>
  );
}
