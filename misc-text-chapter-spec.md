# Misc Text Chapter Format Spec

Different platforms support defining chapters in the media description. The formats differ slightly and there, so I support multiple variants in the same format. They all look similar, but have different delimiters and spacing.

## spotify

spotify has some [documentation](https://support.spotify.com/us/creators/article/creating-and-managing-chapters/) about their inline chapter formats:

### `spotifya`: spotify with parentheses

```text
(00:00) Chapter 1
(00:30) Chapter 2
(01:00) Chapter 3
(01:30) Chapter 4
(01:01:30) Chapter 5
```

### `spotifyb`: spotify with dashes

```text
00:00-Chapter 1
00:30-Chapter 2
01:00-Chapter 3
01:30-Chapter 4
01:01:30-Chapter 5
```

## Youtube

The youtube chapter format will be removed at some point as a standalone format, so I support the format here as well:

### `youtube`: youtube

```text
00:00 Chapter 1
00:30 Chapter 2
01:00 Chapter 3
01:30 Chapter 4
01:01:30 Chapter 5
```

## unknown "podcast shownotes format"

Somebody asked me to support a format that looks like this:

### `shownotes`: unknown "podcast shownotes format"

```text
(00:00)

Welcome to the show

(00:45)

Introducing a Guest
```

I don't know where it is used and no way to test it, so I just support it as a variant. It was referenced as "podcast shownote format" in the issue, but I don't know if that is correct.

## transistor.fm format

Transistor.fm [appears to use a format that looks like this](https://transistor.fm/changelog/timestamps/):

### `transistorfm`: transistor.fm

```text
00:00 - Chapter 1
00:30 - Chapter 2
01:00 - Chapter 3
01:30 - Chapter 4
01:01:30 - Chapter 5
```

## Podigee text format

Apart from it's chapter format, Podigee also supports a [text format](https://help.podigee.com/article/272-importing-chapter-marks-from-a-text-file) that looks like this:

### `podigeetext`: Podigee text format

```text
00:00:00 - Chapter 1
00:00:30 - Chapter 2
00:01:00 - Chapter 3
00:01:30 - Chapter 4
01:01:30 - Chapter 5
```

extremely similar to the transistor.fm format, but apparenlty it requires hours to be specified as well.

## podcastpage format

The podcastpage format is a [text format](https://docs.podcastpage.io/article/33-timestamps) that looks like this:

### `podcastpage`: podcastpage format

```text
(00:00) - Chapter 1
(00:30) - Chapter 2
(01:00) - Chapter 3
(01:30) - Chapter 4
(01:01:30) - Chapter 5
```