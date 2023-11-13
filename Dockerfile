FROM golang as build

WORKDIR /go/src/app
COPY . .

RUN go mod download

RUN CGO_ENABLED=0 go build -o /go/bin/app

FROM gcr.io/distroless/static-debian11
LABEL org.opencontainers.image.source=https://github.com/janstuemmel/cs2-rcon

COPY --from=build /go/bin/app /
CMD ["/app"]
