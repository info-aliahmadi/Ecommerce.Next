import {Typography} from '@mui/material';
import CurrencyTypes from '@root/app/types/enums/CurrencyTypes';

interface CurrencyLableProps {
  value: number;
  currencyType?: CurrencyTypes;
  showValue?: boolean | true;
}

const CurrencyLable = ({
  value = 0,
  currencyType = CurrencyTypes.Dinar,
  showValue = true,
}: CurrencyLableProps) => {
  const getCurrencyName = (type: CurrencyTypes): string => {
    switch (type) {
      case CurrencyTypes.Dinar:
        return 'IQD';
      case CurrencyTypes.Rial:
        return 'ریال';
        case CurrencyTypes.Toman:
          return 'تومان';
      case CurrencyTypes.Dollar:
        return 'USD';
      case CurrencyTypes.Euro:
        return 'EUR';
      case CurrencyTypes.None:
        return 'None';
      default:
        return 'Unknown';
    }
  };

  const currencyName = getCurrencyName(currencyType);

  return (
    <>
      <Typography component="span" sx={{textAlign: 'left'}}>
        {' '}
        {showValue ? value?.toLocaleString() : ''}
      </Typography>
      <Typography
        component="span"
        variant="body2"
        sx={{color: 'gray', fontSize: 12, ml: 0.5, textAlign: 'left'}}>
        {currencyName}
      </Typography>
    </>
  );
};

export default CurrencyLable;
