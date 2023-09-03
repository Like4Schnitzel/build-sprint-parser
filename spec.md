# Build sprint save format spec
## Starting out

First 3 bytes: 66, 83, 80
This is the file signature/header to make sure we're not trying to load some irrelevant file/data.

Next 4 bytes: The file version, as an unsigned integer. This is used for backwards-compatibility.

Next 4 bytes: The uncompressed size of the compressed blob (in bytes)
The rest of the file: The compressed blob
So far all file versions (0 to 4) use Deflate for the compression. I will (or you will) have to look for more details about how to uncompress this from Godot's documentation or source code.
## Arrays
So, we've uncompressed the remaining bytes! Great!

Now, we have some "short", "medium" and "long" arrays ahead.

When we encounter a...
..."short" array, we decode the next byte (8 bits) as the length of the array, and then decode that many bytes.
..."medium" array, we decode the next 2 bytes (16 bits) as the length of the array, and then decode that many bytes.
..."long" array, we decode the next 4 bytes (32 bits) as the length of the array, and then decode that many bytes.

Additionally, all strings are stored as UTF-8 (unless noted otherwise)
## Continuing on with the decoding

Build name: short array -> String (Remember, UTF-8!)
Author name: short array -> String
Description: **medium** array -> String

Block data: long array -> custom format that is not documented (at least yet, don't count on this being documented)