import { Redirect } from "expo-router";

export default function Index() {
  const isSignedIn = true;

  if (isSignedIn) {
    return <Redirect href="/home/(tabs)/discover" />;
  }

  return <Redirect href="/onboarding" />;
}
