export const MOVIE_DATA = {
  "movie-a-title": {
    // This is the entire domain for the stream
    domain: "https://be7713.rcr82.waw05.i8yz83pn.com",
    // This is the variable part of the path (Folder A/Folder B/Content ID)
    path: "01/03454/n4afqaq1f3fz_x",
    // This is the full, unique, and temporary authentication query string
    tokens:
      "t=8oQ18MkJGqRlMZYES6i_N1LXrAZT3ANLfQSqYP9K_1Y&s=1759050036&e=10800&f=20243595&srv=30&asn=8708&sp=5500&p=",
  },
  "movie-b-title": {
    domain: "https://fin-3dg-b1.i8yz83pn.com",
    path: "07/03525/0k71n8rdyv95_x",
    tokens:
      "t=10u6gGN_jLyla1Qy0tsZm_yizcVFc_tcc2ED2VLitlY&s=1759051366&e=10800&f=20259102&srv=1055&asn=8708&sp=5500&p=",
  },
  // Add more movies here...
};

// Standard file path components:
export const BASE_PATH = "/hls2/";
export const MANIFEST_FILE = "/index-v1-a1.m3u8";
