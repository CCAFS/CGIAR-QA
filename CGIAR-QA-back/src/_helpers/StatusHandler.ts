export enum StatusHandler {
    Complete = 'complete',
    Pending = 'pending',
    Finalized = 'finalized',
    Autochecked = 'autochecked'
    // Open = 'open',
    // Reopen = 'reopen',
}

export enum StatusHandlerMIS {
    complete = 'in_progress',
    pending = 'pending',
    pending_crp = 'pending_crp',
    finalized = 'quality_assessed',
    autochecked = 'automatically_validated'
}