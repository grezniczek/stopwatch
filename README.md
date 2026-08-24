# Stopwatch

A flexible REDCap External Module that adds stopwatch widgets to data-entry forms and surveys. It can store elapsed time, captures, laps, and start/stop timestamps in several formats.

## Bugs / Feature Requests

To report a bug or request a feature, please open an issue on the module's [GitHub](https://github.com/grezniczek/stopwatch/issues) page.

## Installation

1. Obtain the module from the Consortium REDCap Repo through the Control Center, or clone this repository into `<redcap-root>/modules/stopwatch_v<version-number>`.
2. In **Control Center > Technical / Developer Tools > External Modules**, enable the module.
3. Enable the module for each project that will use it.

## Use

- To add a stopwatch to a form or survey, either add **@STOPWATCH** to a field with a compatible storage type (see below), or add it to any field and configure a separate `target` field.
- The field with the action tag will be referred to as "the @STOPWATCH field".
- In the @STOPWATCH field, the stopwatch widget will be shown in the label or data area, depending on whether the `target` is a different field or the @STOPWATCH field.
- Multiple stopwatches can be used on the same form.
- Each stopwatch must have a unique `target`.
- Only one **@STOPWATCH** action tag can be used within each field.

## Action Tag Configuration

The stopwatch is configured with a valid JSON parameter object (see [JSONLint](https://jsonlint.com/)). Invalid JSON is reported on the affected field. All general parameters below are optional.

```text
@STOPWATCH=
{
  "string": "value",
  "bool": true,
  "number": 5
}
```

_Note:_ When providing parameters, the equal sign `=` must directly follow the action tag. Whitespace, including line breaks, may appear between `=` and the opening curly brace.

- `mode` - Mode can be one of the following:
  - `basic` - A simple stopwatch with start/stop and reset buttons. The elapsed time is recorded. This is the default.
  - `capture` - A stopwatch that can record multiple captures of the (until then) elapsed time (see below for details). `@STOPWATCH-CAPTURE` can be used as a shortcut.
  - `lap` - A stopwatch that can record multiple laps (see below for details). `@STOPWATCH-LAP` can be used as a shortcut.

- `id` - An identifier for the stopwatch. If this is not specified, the name of the `target` field will be used. This is useful when storing the data of multiple stopwatches within a single repeating instrument (see below).

- `target` - The field in which the elapsed time is to be stored. By default, this will be the @STOPWATCH field (in which case its type and validation must be compatible - see below).

- `show_target` - Boolean (`true`|`false`) that determines whether the target input is shown on data-entry forms (default: `false`).

- `show_target_survey` - Boolean (`true`|`false`) that determines whether the target input is shown on survey pages (default: `false`).

- `resume` - Boolean (`true`|`false`) that determines whether stopping and resuming the timer is allowed (defaults to `false`).

- `digits` - The precision to show (0, 1, 2, or 3).

- `h_digits`, `m_digits`, `s_digits` - The (minimal) number of digits to use for hours, minutes, seconds (when shorter, values will be padded with 0).

- `no_hours` - Boolean (`true`|`false`). If set to `true`, minutes will be the largest unit counted.

- `no_minutes` - Boolean (`true`|`false`). If set to `true`, seconds are the largest unit counted. This implies `no_hours: true`.

- `decimal_separator` - The separator inserted between seconds and fractional seconds. Certain target field types override this value.

- `group_separator` - The character(s) inserted between hours, minutes, seconds.

- `unset_display_symbol` - The symbol to be used as a digit replacement when no value has been set.

- `display_format` - The format for display in the stopwatch widget.

- `display_running` - When set, this will be displayed when the stopwatch is currently running.

- `display_empty` - When set, this will be displayed when the stopwatch has no value(s).

### Additional configuration for capture and lap modes

By default, capture and lap data is stored as JSON in a _Notes Box_ or an unvalidated _Text Box_. When `mapping` is supplied, each capture or lap is stored in a repeating instrument instead. In that case, `target` must still be an unvalidated _Text Box_, because it holds internal metadata; it will usually be hidden and read-only.

- `mapping` - A JSON object with the following keys. All except `elapsed` are optional. Mapping fields must be on the same repeating instrument, separate from the @STOPWATCH field. The exact storage format depends on the chosen field type (see below). Unsupported keys are reported as configuration errors.
  - `id` - Field for storing the identifier of the stopwatch. This must be an unvalidated _Text Box_ on the same repeating instrument as the other mappings. It is useful when several stopwatches write to the same repeating instrument.
  - `elapsed` - Field for storing the elapsed time. This mapping **must** be provided.
  - `start` - Field for storing the date/time the capture was (first) started.
  - `stop` - Field for storing the date/time the capture was (last) stopped.
  - `index` - Field for storing the index (starting at 1) of the lap/capture within a measurement (the target field must be of type integer).
  - `cumulated` (`lap` mode only) - Field for storing the cumulated elapsed time.
  - `num_stops` (`lap` mode only) - Field for storing the number of times the timer was stopped during recording of a lap (the target field must be of type integer).
  - `is_stop` (`capture` mode only) - Field for storing the stop flag (the target field must be of type integer - it will hold 0 or 1).

- `event` - The name or numerical ID of the event containing the repeating instrument. If omitted, the current event is used.

- `only_once` - Boolean (`true`|`false`) determining whether the stopwatch can be used again once a value has been recorded. The default is `false`.

- `max_rows` - The maximum number of rows to show in the captures/laps table. Default = 0 (no limit).

- `at_top` - Boolean (`true`|`false`) determining whether the stopwatch is shown vertically aligned at the top. The default is `true`.

- `cumulated` (available in `lap` mode only) - Boolean (`true`|`false`). If set to `true`, an additional column with cumulated elapsed time will be shown.

### Format of the stored values

Stopwatch will honor the format (validation) of the target field(s). The target field has to be of type _Text Box_ or _Notes Box_.

Elapsed time will be stored as follows:

- _Integer_: elapsed time in milliseconds.
- _Number_: elapsed time in seconds (with fractional seconds).
- _Time (MM:SS)_: elapsed time in minutes and seconds (limited to a maximum of 59:59).
- No validation: the elapsed time will be stored as `h:m:s.f` (colons and dot).

For capture and lap data values other than elapsed time, the following automatic formats will be used, depending on the selected field type:

- _Integer_: a Unix timestamp in milliseconds since 01 January 1970 00:00:00 UTC.
- _Number_: as above, but in seconds (including fractional seconds).
- _Date_: the date; time information is discarded.
- _Datetime_: the date and time, rounded to the precision supported by the selected validation.
- No validation: an ISO 8601 timestamp in the form `YYYY-MM-DDTHH:mm:ss.sssZ`.

For date and datetime mappings, the module stores REDCap's standard underlying `YYYY-MM-DD` or `YYYY-MM-DD HH:mm[:ss]` value. REDCap displays it according to the field's validation setting.

### Format of the timer display

To set the display format, the following placeholders can be used:

- `/h` - hours (1 or more digits)
- `/m` - minutes (2 digits)
- `/s` - seconds (2 digits)
- `/f` - fractional seconds
- `/S` - total seconds (with fractional seconds)
- `/F` - total milliseconds
- `/g` - group separator
- `/d` - decimal separator

The display format for e.g. `0:02:33.12` can be written as `/h/g/m/g/s/d/f`, and `digits` would have to be set to `2`.

### Button and other labels

Labels of buttons and other display elements can be customized using the following parameters:

- `label_start` - Start button label. Default is 'Start'.
- `label_resume` - Resume button label. Default is 'Resume'.
- `label_stop` - Stop button label. Default is 'Stop'.
- `label_reset` - Reset button label. Default is 'Reset'.
- `label_lap` - Lap button label (also used as row label). Default is 'Lap'.
- `label_capture` - Capture button label (also used as row label). Default is 'Capture'.
- `label_elapsed` (`lap` mode only) - Header for the elapsed time column. Default is 'Lap time'.
- `label_cumulated` (`lap` mode only) - Header for the cumulated time column. Default is 'Cumulated'.

## Module Configuration

Behavior of the module can be configured at the project level:

- **Enable JavaScript debug logging**: When enabled, the module will output debug information to the browser console.

## Examples

A demo project is available [here](demo-project/StopwatchEMTest.xml).

**Simple Stopwatches** - capture elapsed time only:

![Simple](images/examples1-7.png)

1. No data captured yet. The stopwatch can be started by clicking the green 'Start' button.

   ```json
   @STOPWATCH
   ```

2. Timer has run. Can be reset.  

   ```json
   @STOPWATCH={ "digits": 2, "show_target": true }
   ```

3. Resume is enabled for this stopwatch. The stopwatch is currently stopped, but can be resumed (or reset).  

   ```json
   @STOPWATCH={ "digits": 1, "resume": true }
   ```

4. This stopwatch is currently running, as indicated by the red 'Stop' button.  

   ```json
   @STOPWATCH
   ```

5. This shows storage in a _Text Box_ without validation.  

   ```json
   @STOPWATCH={ "show_target": true }
   ```

6. This stopwatch has been configured so the user is blinded regarding the elapsed time.

   ```json
   @STOPWATCH={
      "display_format": "Blinded",
      "display_running": "Running",
      "display_empty": "--:--.--"
   }
   ```

7. This illustrates a case in which something is going wrong. A very visible error message is displayed in case of a configuration error.

**Advanced Stopwatches** - capture multiple timepoints / laps:

![Capture and lap examples](images/examples8-11.png)

8. Multiple captures into a _Notes Box_ (as a JSON data structure, here shown explicitly).  

   ```json
   @STOPWATCH=
   {
     "mode": "capture",
     "resume": true,
     "show_target": true
   }
   ```

9. Shortcut for a stopwatch with a basic capture setup. No further configuration is needed. Resuming is not allowed by default.

   ```json
   @STOPWATCH-CAPTURE
   ```

10. Shortcut for a stopwatch that records laps. Resuming is not allowed by default. The display is restored after saving the form.

   ```json
   @STOPWATCH-LAP
   ```

11. A stopwatch for capturing laps, showing a _cumulated_ column. The display format has been set so that hours are not shown (the number of minutes will exceed 59) and fractional seconds are rounded to 2 digits.

    ```json
    @STOPWATCH-LAP=
    {
      "cumulated": true,
      "no_hours": true,
      "display_format": "/m/g/s/d/f",
      "digits": 2
    }
    ```

**Advanced Stopwatches** - capture multiple timepoints / laps into a repeating instrument:

![Repeating-instrument mapping example](images/example12.png)

12. Multiple captures can be stored in a repeating instrument when `mapping` maps data items to fields on that instrument. The report below shows the stored values. Field validation controls the storage format: _Elapsed_ (integer) stores milliseconds, _Cumulated_ (number) stores seconds, _Start_ and _Stop_ (no validation) store browser-generated ISO 8601 timestamps, and _Time stopped?_ records how often the timer was stopped while recording a lap.

    ```json
    @STOPWATCH-LAP=
    {
      "cumulated": true,
      "mapping": {
        "id": "stopwatch_id",
        "elapsed": "store_elapsed",
        "cumulated": "store_cumulated",
        "start": "store_start",
        "stop": "store_stop",
        "num_stops": "store_num_stops"
      },
      "resume": true
    }
    ```

![Repeating-instrument report](images/example12-report.png)

## Integration with Missing Data Codes

Stopwatch supports Missing Data Codes. When set, the stopwatch is disabled and shows the placeholder value. When the missing data code is removed, the stopwatch becomes available again.

![Missing-data-code example](images/examples-mdc.png)

## Acknowledgements

This module uses some code from Andy Martin, including ActionTagHelper and related utilities.

The v1.2.0 reliability release also benefited from a rigorous code-review and testing collaboration with OpenAI Codex (GPT-5). It helped identify edge cases in repeat storage, datetime conversion, configuration validation, and PHP 8 compatibility; the maintainer reviewed and manually verified each resulting change.

## Changelog

### v1.2.0

- Reliability fixes for repeat-storage resets, summaries, request payloads, mapping validation, and the correct source instance.
- Corrected date, datetime, and UTC timestamp mapping conversions.
- Improved PHP 8 compatibility by handling missing optional values, action-tag types, and untagged fields safely.
- Invalid action-tag JSON and repeat-storage mapping keys are now reported on the affected field.
- Action-tag descriptions, widget accessibility text, and remaining runtime messages now use the module language strings.
- Corrected the documented action-tag spelling to use dashes rather than underscores.

### Earlier releases

Version | Description
------- | ---------------------
v1.1.0  | Updated framework version (14; REDCap 13.7.3+); fixed Bootstrap 5 issues; action tags are now shown in the list of action tags.
v1.0.6  | Add support for multiple redcap_data tables.
v1.0.5  | Bugfix: The module would not work on classic projects (i.e. non-longitudinal and/or not having repeating forms/events).
v1.0.4  | Bugfix: IE11 compatibility.
v1.0.3  | Bugfix: Stops counter now works properly.<br>Enhancement: Better focus handling.
v1.0.2  | Change: Multi-capture stopwatches are now located at the top of their container (to avoid movement of the widget when rows are added; this can be controlled with a new setting).<br>New feature: The laps/captures index can now be mapped when storing data in a repeating instrument.<br>Misc: Added GitHub link to byline and README.
v1.0.1  | Bug fixes: Lap cumulated time was not restored properly (this was a display issue only).
v1.0.0  | Initial release.
