import React, { useState, useEffect } from "react";

import { TabMenu } from "primereact/tabmenu";
import { Button } from "primereact/button";
import Router, { useRouter } from "next/router";

export default function NavMenu({ setActiveIndex, activeIndex }) {
  const router = useRouter();

  useEffect(() => {
    if (router?.pathname === "/") setActiveIndex(0);
    else if (router?.pathname === "/invites") setActiveIndex(1);
  });

  const items = [
    {
      label: "Home",
      icon: "pi pi-fw pi-home",
      command: () => {
        router.push("/");
      },
    },
    {
      label: "Invites",
      icon: "pi pi-fw pi-user-plus",
      command: () => {
        router.push("/invites");
      },
    },
  ];

  return (
    <div>
      <div className="card">
        <TabMenu
          model={items}
          activeIndex={activeIndex}
          onTabChange={(e) => setActiveIndex(e.index)}
        />
      </div>

      <div className="card">
        {/* <h5>Programmatic</h5>
        <div className="pt-2 pb-4">
          <Button
            onClick={() => setActiveIndex(0)}
            className="p-button-text"
            label="Activate 1st"
          />
          <Button
            onClick={() => setActiveIndex(1)}
            className="p-button-text"
            label="Activate 2nd"
          />
          <Button
            onClick={() => setActiveIndex(2)}
            className="p-button-text"
            label="Activate 3rd"
          />
        </div> */}

        {/* <TabMenu
          model={items}
          activeIndex={activeIndex}
          onTabChange={(e) => setActiveIndex(e.index)}
        /> */}
      </div>
    </div>
  );
}
