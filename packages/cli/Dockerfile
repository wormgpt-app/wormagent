FROM alpine AS base

ARG BUN_RUNTIME_TRANSPILER_CACHE_PATH=0
ENV BUN_RUNTIME_TRANSPILER_CACHE_PATH=${BUN_RUNTIME_TRANSPILER_CACHE_PATH}
RUN apk add --no-cache libgcc libstdc++ ripgrep

FROM base AS build-amd64
COPY dist/cli-linux-x64-baseline-musl/bin/wormagent /usr/local/bin/wormagent

FROM base AS build-arm64
COPY dist/cli-linux-arm64-musl/bin/wormagent /usr/local/bin/wormagent

ARG TARGETARCH
FROM build-${TARGETARCH}
RUN ln -s wormagent /usr/local/bin/wormagent2 && wormagent --version && wormagent2 --version
ENTRYPOINT ["wormagent"]
