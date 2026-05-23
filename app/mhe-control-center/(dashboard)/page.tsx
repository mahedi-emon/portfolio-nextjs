import { redirect } from "next/navigation";
import { ADMIN_DASHBOARD_PATH } from "@/lib/constants";

export default function ControlCenterRoot() {
  redirect(ADMIN_DASHBOARD_PATH);
}
