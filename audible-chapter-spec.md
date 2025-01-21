# Audible Chapter Spec

This document describes the structure of an Audible chapter format that is used
by audible's web player and presumably their mobile apps.

The format is part of an endpoint that audible calls `licenserequest` which contains other information about the book and the current user's license, which is is out of the scope of this document.

```json
{
  "content_license": {
    "content_metadata": {
      "chapter_info": {
        "brandIntroDurationMs": 2043,
        "brandOutroDurationMs": 5061,
        "chapters": [
          {
            "length_ms": 15154,
            "start_offset_ms": 0,
            "start_offset_sec": 0,
            "title": "Opening Credits"
          },
          {
            "length_ms": 3450888,
            "start_offset_ms": 15154,
            "start_offset_sec": 15,
            "title": "Introduction"
          },
          {
            "length_ms": 7019855,
            "start_offset_ms": 3466042,
            "start_offset_sec": 3466,
            "title": "Chapter 1."
          },
          {
            "length_ms": 10525325,
            "start_offset_ms": 10485897,
            "start_offset_sec": 10486,
            "title": "Chapter 2."
          },
          {
            "length_ms": 8016827,
            "start_offset_ms": 21011222,
            "start_offset_sec": 21011,
            "title": "Chapter 3."
          },
          {
            "length_ms": 6340115,
            "start_offset_ms": 29028049,
            "start_offset_sec": 29028,
            "title": "Chapter 4."
          },
          {
            "length_ms": 8660485,
            "start_offset_ms": 35368164,
            "start_offset_sec": 35368,
            "title": "Chapter 5."
          },
          {
            "length_ms": 6277049,
            "start_offset_ms": 44028649,
            "start_offset_sec": 44029,
            "title": "Chapter 6."
          },
          {
            "length_ms": 1765645,
            "start_offset_ms": 50305698,
            "start_offset_sec": 50306,
            "title": "Conclusion"
          },
          {
            "length_ms": 379599,
            "start_offset_ms": 52071343,
            "start_offset_sec": 52071,
            "title": "Acknowledgments"
          },
          {
            "length_ms": 23033,
            "start_offset_ms": 52450942,
            "start_offset_sec": 52451,
            "title": "End Credits"
          }
        ],
        "is_accurate": true,
        "runtime_length_ms": 52473975,
        "runtime_length_sec": 52474
      }
    }
  }
}
```