

import React from "react";
import NotificationDropdown from "../notifications/NotificationDropdown";

const ClientNotificationDropdown = ({ isOpen, onClose, onChanged }) => {
  return (
    <NotificationDropdown
      isOpen={isOpen}
      onClose={onClose}
      onChanged={onChanged}
      userRole="CLIENT"
    />
  );
};

export default ClientNotificationDropdown;