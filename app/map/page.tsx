import { redirect } from "next/navigation";

// The old world-map screen was retired in favor of the continuous Play flow.
export default function MapRedirect() {
  redirect("/play");
}
