import { VFS_CONTRACT } from "@/src/lib/evm-helper";
import { unstable_cache } from "next/cache";


export const queryResolvePath = (path: string) => unstable_cache(async () => {
    const resolvedPath = await VFS_CONTRACT.read.resolve_path([path]);
    return resolvedPath;
}, ["vfs", "path", path], {
    revalidate: 60 * 60 * 24, // 24 hours
})