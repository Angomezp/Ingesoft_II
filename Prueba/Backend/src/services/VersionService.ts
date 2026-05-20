import { env } from "./../config/env.ts";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "url";

export type VersionComparison = "equal" | "higher" | "lower";

export type VersionStatus = {
    endpointVersion: string;
    localVersionConfigured: boolean;
    comparison?: VersionComparison;
    message?: string;
};

function parseVersion(version: string): number[] {
    return version
        .trim()
        .replace(/^v/i, "")
        .split(".")
        .map((part) => {
            const numericPart = part.match(/^\d+/)?.[0] ?? "0";
            return Number(numericPart);
        });
}

function compareVersions(localVersion: string| undefined, endpointVersion: string): VersionComparison {
    const localParts = parseVersion(localVersion || "");
    const endpointParts = parseVersion(endpointVersion);
    const totalParts = Math.max(localParts.length, endpointParts.length);

    for (let index = 0; index < totalParts; index += 1) {
        const difference = (localParts[index] ?? 0) - (endpointParts[index] ?? 0);

        if (difference > 0) {
            return "higher";
        }

        if (difference < 0) {
            return "lower";
        }
    }

    return "equal";
}

export async function getVersionStatus(): Promise<VersionStatus> {
    const url = env.API_BASE_URL + `/apicontrollerpruebas/api/ParametrosFramework/ConsultarParametrosFramework/VPStoreAppControl`;
    const responseVersion = await fetch(url);

    if (!responseVersion.ok) {
        throw new Error(`Failed to fetch version: ${responseVersion.status} ${responseVersion.statusText}`);
    }

    const versionData: unknown = await responseVersion.json();

    let endpointVersion = "";

    if (typeof versionData === "string" || typeof versionData === "number") {
        endpointVersion = String(versionData).trim();
    } else if (typeof versionData === "object" && versionData !== null) {
        const anyData = versionData as any;
        if ("version" in anyData && (typeof anyData.version === "string" || typeof anyData.version === "number")) {
            endpointVersion = String(anyData.version).trim();
        }
    }

    if (!endpointVersion) {
        throw new Error("Invalid version payload from endpoint");
    }

    let localVersion = env.VERSION;

    if (!localVersion) {
        try {
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename);
            const envPath = path.resolve(__dirname, '../../.env');

            let envContent: string | null = null;
            envContent = await fs.readFile(envPath, 'utf8');
            

            if (envContent === null) {
                await fs.writeFile(envPath, `VERSION=${endpointVersion}\n`, 'utf8');
            } else {
                const regex = /^VERSION\s*=.*$/m;
                if (regex.test(envContent)) {
                    envContent = envContent.replace(regex, `VERSION=${endpointVersion}`);
                } else {
                    if (!envContent.endsWith('\n')) envContent += '\n';
                    envContent += `VERSION=${endpointVersion}\n`;
                }
                await fs.writeFile(envPath, envContent, 'utf8');
            }

            console.log(`Saved VERSION=${endpointVersion} to ${envPath}`);
            // use the saved version as localVersion for comparison
            localVersion = endpointVersion;
        } catch (err) {
            console.error('Failed to write .env VERSION:', err);
            // fall through and continue without local version
        }
    }

    const comparison = compareVersions(localVersion, endpointVersion);

    if (comparison === "equal") {
        return {
            endpointVersion,
            localVersionConfigured: true,
            comparison,
        };
    }

    return {
        endpointVersion,
        localVersionConfigured: true,
        comparison,
        message:
            comparison === "higher"
                ? "Tu versión es superior a la del endpoint"
                : "Tu versión es inferior a la del endpoint",
    };
}


