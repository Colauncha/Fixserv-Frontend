
import React from "react";
import NotificationDropdown from "../notifications/NotificationDropdown";

const ArtisanNotification = ({ isOpen, onClose, onChanged }) => {
  return (
    <NotificationDropdown
      isOpen={isOpen}
      onClose={onClose}
      onChanged={onChanged}
      userRole="ARTISAN"
    />
  );
};

export default ArtisanNotification;