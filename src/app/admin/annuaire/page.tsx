import { getDirectoryEntries } from "@/lib/actions";
import DirectoryAdmin from "./DirectoryAdmin";

export default async function Page() {
  const entries = await getDirectoryEntries();
  return <DirectoryAdmin items={JSON.parse(JSON.stringify(entries))} />;
}
