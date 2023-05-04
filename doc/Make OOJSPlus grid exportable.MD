# Making OOJSPlus grid exportable

## Generic
The easiest way is just to specify `exportable: true` in the grid configuration.
This will add a button to the toolbar to export the grid.

This will use current data and columns to export the grid. It will not export all of the data, in case there
are multiple pages.

## Providing the data

### In configuration
To get more control over what is exported, specify `provideExportData` function in the grid config.
This function should return a promise that resolves to a `<table>` element.

### In the grid
In case you have your own grid class, specify `provideExportData` function, which performs the
same function as the `provideExportData` callback in the config, just as a proper part of the grid class.

In case of custom grid class, make sure to set `exportable: true` to the config BEFORE calling the parent.
