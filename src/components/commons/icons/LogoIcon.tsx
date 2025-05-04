import React from 'react';
import UniprotIcon from '../../../assets/images/uniprot.png';
import ChebiIcon from '../../../assets/images/ChEBI_logo.png';
import CPXIcon from '../../../assets/images/cpx-logo.png';
import MatrixdbIcon from '../../../assets/images/matrixdb_logo_medium.png';
import IntactIcon from '../../../assets/images/intact_logo.png';
import BgeeIcon from '../../../assets/images/bgee_logo.png';
import MatrisomeIcon from '../../../assets/images/matrisome_logo.png';
import ImexIcon from '../../../assets/images/imexlogo.png';

interface LogoIconProps {
    logoName: string;
    width: string;
    height: string;
}

const LogoIcon: React.FC<LogoIconProps> = ({ logoName, width, height }) => {
    let iconPath;

    switch (logoName) {
        case 'uniprot':
            iconPath = UniprotIcon;
            break;
        case 'complex-portal':
            iconPath = CPXIcon;
            break;
        case 'chebi':
            iconPath = ChebiIcon;
            break;
        case 'matrixdb':
            iconPath = MatrixdbIcon;
            break;
        case 'intact':
            iconPath = IntactIcon;
            break;
        case 'matrisome':
            iconPath = MatrisomeIcon;
            break;
        case 'bgee':
            iconPath = BgeeIcon;
            break;
        case 'imex':
            iconPath = ImexIcon;
            break;
        default:
            iconPath = null; // Handle case where no icon matches
            break;
    }

    return (
        <>
            {iconPath && (
                <img src={iconPath} alt={logoName} width={width} height={height} />
            )}
        </>
    );
};

export default LogoIcon;
