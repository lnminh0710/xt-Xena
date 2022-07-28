import * as appPipes from 'app/pipes';
export * from './app.pipe';

export const APP_PIPES = [
    appPipes.CellRangePipe,
    appPipes.GlbzPipe,
    appPipes.ToDatePipe,
    appPipes.SafePipe,
    appPipes.ToStringPipe,
    appPipes.ToTypePipe,
    appPipes.ToPathImage,
    appPipes.DisplaySeparator,
    appPipes.ToNumberPipe,
    appPipes.ToOrderBy,
    appPipes.CallbackPipe,
    appPipes.SafeHtml,
    appPipes.EscapeHtmlPipe
];
