import FilterManager, {Filter} from "./FilterManager";
import {FilterViewConfigurationBuilder} from "./FilterViewConfigurationBuilder";

export enum FilterOptionType {
    list = 'LIST',
    numeric = 'NUMERIC'
}

export interface FilterCriterionOptions {
    type: FilterOptionType,
    range : any[] | [],
}

export interface FilterCriterionConfiguration {
    id: string,
    label: string,
    options?: FilterCriterionOptions,
    value?: any,
    subCriteria?: FilterCriterionConfiguration[],
    condition?: (filters: Filter) => boolean,
    enable?: boolean
}

export interface FilterConfiguration {
    [key: string]: FilterCriterionConfiguration[]
}


/**
 * Manager class which builds the FilterConfiguration for FilterView using the Configuration Builder
 */
export class FilterConfigurationManager {

    private readonly networkData: any;
    private filterManager : FilterManager;
    private filterConfiguration: FilterConfiguration = {
        interactor: [
            {
                id: 'type',
                label: 'Type',
                options: {
                    type: FilterOptionType.list,
                    range: []
                }
            },
            {
                id: 'ecm',
                label: 'ECM Biomolecule',
                options: {
                    type: FilterOptionType.list,
                    range: []
                },
                /*condition: (filter) => {
                    if(filter.interactors.length === 0 ) return false
                    return filter.interactors
                        .map((filterCriterion) => filterCriterion.id === 'type' && filterCriterion.value === 'protein')
                        .reduce((finalValue: boolean, currentValue: boolean) => finalValue || currentValue, false);
                }*/
            },
            {
                id: 'geneExpression',
                label: 'Transcriptomic Data',
                subCriteria: [
                    {
                        id: 'tissue',
                        label: 'Tissue',
                        options: {
                            type: FilterOptionType.list,
                            range: []
                        },
                    },
                    {   id: 'tpm',
                        label: 'Expression Value (TPM)',
                        options: {
                            type: FilterOptionType.numeric,
                            range: []
                        }
                    }
                ],
                /*condition: (filter) => {
                    if(filter.interactors.length === 0 ) return false
                    return filter.interactors
                        .map((filterCriterion) => filterCriterion.id === 'type' && filterCriterion.value === 'protein')
                        .reduce((finalValue: boolean, currentValue: boolean) => finalValue || currentValue, false);
                }*/
            },
            {
                id: 'proteomicsExpression',
                label: 'Proteomic Data',
                subCriteria: [
                    {
                        id: 'tissue',
                        label: 'Tissue',
                        options: {
                            type: FilterOptionType.list,
                            range: []
                        },
                    },
                    {
                        id: 'sampleName',
                        label: 'Sample',
                        options: {
                            type: FilterOptionType.list,
                            range: []
                        },
                    },
                    {   id: 'score',
                        label: 'Normalized Spectral Abundance Factor (NSAF)',
                        options: {
                            type: FilterOptionType.numeric,
                            range: []
                        }
                    }
                ],
                /*condition: (filter) => {
                    if(filter.interactors.length === 0 ) return false
                    return filter.interactors
                        .map((filterCriterion) => filterCriterion.id === 'type' && filterCriterion.value === 'protein')
                        .reduce((finalValue: boolean, currentValue: boolean) => finalValue || currentValue, false);
                }*/
            }
        ],
        interaction: [
            {
                id: 'type',
                label: 'Type',
                options: {
                    type: FilterOptionType.list,
                    range: []
                }
            },
            {
                id: 'detection_method',
                label: 'Detection Method',
                options: {
                    type: FilterOptionType.list,
                    range: []
                }
            },
            {
                id: 'score',
                label: 'Confidence Score',
                options: {
                    type: FilterOptionType.numeric,
                    range: []
                }
            }
        ]
    }
    constructor(networkData: any) {
        this.networkData = networkData;
        this.filterManager = new FilterManager(this.networkData, this.filterConfiguration);
    }

    public getFilterConfiguration (filters?: any) {
        if(filters && (filters.interactors.length > 0 || filters.interactions.length > 0)) {
            return new FilterViewConfigurationBuilder(this.filterConfiguration, this.filterManager)
                .with(filters)
                .build();
        } else {
            return new FilterViewConfigurationBuilder(this.filterConfiguration, this.filterManager)
                .build();
        }
    }

}

