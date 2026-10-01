import arrowIcon from "../../assets/icons/arrow.svg?react";
import bellIcon from "../../assets/icons/bell.svg?react";
import calendarIcon from "../../assets/icons/calendar.svg?react";
import checkIcon from "../../assets/icons/check.svg?react";
import closeIcon from "../../assets/icons/close.svg?react";
import errorIcon from "../../assets/icons/error.svg?react";
import logOutIcon from "../../assets/icons/log_out.svg?react";
import ticketIcon from "../../assets/icons/ticket.svg?react";
import timerIcon from "../../assets/icons/timer.svg?react";
import userIcon from "../../assets/icons/user.svg?react";

const iconMap = {
  arrow: arrowIcon,
  bell: bellIcon,
  calendar: calendarIcon,
  check: checkIcon,
  close: closeIcon,
  error: errorIcon,
  logOut: logOutIcon,
  ticket: ticketIcon,
  timer: timerIcon,
  user: userIcon,
};

export default function Icon({ name, className = "" }) {
  const SvgComponent = iconMap[name];

  if (!SvgComponent) return null;

  return <SvgComponent className={className} />;
}
