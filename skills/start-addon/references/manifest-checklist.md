# Manifest checklist

## Required identity fields

- testId or addOnVersion-relevant id
- name
- version
- main entry point that matches the actual file shipped

## Runtime declarations

- entryPoints listed correctly for the runtime split
- documentSandbox section present only if the add-on actually uses sandbox
- script paths reflect build vs no-build template style

## Permissions

- sandbox declared only when needed
- oauth hostnames declared when an external service is integrated
- allow-downloads declared when the add-on triggers downloads
- requirements section declares experimentalApis and renditionPreview only when the add-on actually depends on them

## Common manifest pitfalls

- mixing build-template paths with no-build template runtime declarations
- forgetting to update the manifest after renaming or moving entry files
- declaring permissions defensively rather than based on actual code paths

## Verification flow

- read manifest.json end to end
- match every declared entry point against the actual file system
- match every declared permission against actual feature usage
- remove anything declared but not used
