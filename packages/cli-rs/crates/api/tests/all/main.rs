//! The API client's integration tests, one module per area, linked into one binary. Select an area with
//! `cargo test -p wormagent-api --test all <module>::`.

mod api;
mod live;
mod oracle;
mod review;
mod sse;
