export enum DetailedStatus {
    Complete = 'complete',
    Pending = 'pending',
    Finalized = 'finalized',
}
export enum GeneralStatus {
    Open = 'open',
    Close = 'close'
}

export enum GeneralIndicatorName {
    qa_policies = 'Policies',
    qa_innovations = 'Innovations',
    qa_publications= 'Peer Reviewed Papers',
    qa_oicr= 'OICRs',
    qa_melia= 'MELIAs',
    qa_capdev= 'CapDevs',
    qa_milestones= 'Milestones',
    qa_slo= 'SLOs',
    qa_outcomes= 'Outcomes',
}

export enum TagMessage {
    agree = 'agrees with a comment in',
    disagree = 'disagrees with a comment in',
    notsure = 'is not sure about comment in',
    seen = 'has seen a comment in'
}