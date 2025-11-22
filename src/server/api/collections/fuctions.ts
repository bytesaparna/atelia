import { ParamType } from "ethers";

export function getStructAbi(abi: any, internalType: string): ParamType | null {
    for (const f of abi) {
        const inputs = f.inputs || [];
        for (const inp of inputs) {
            if (inp.internalType === internalType) return cleanParamType(inp);
            // also search recursively
            if (inp.components) {
                const found = getStructAbi(inp.components, internalType);
                if (found) return cleanParamType(found);
            }
        }
    }
    return null;
}

function cleanParamType(obj: any): ParamType {
    const clone = { ...obj };
    delete clone.indexed;    // ← remove the root indexed

    if (clone.components) {
        clone.components = clone.components.map(cleanParamType); // ← remove nested indexed
    }

    return clone;
}
