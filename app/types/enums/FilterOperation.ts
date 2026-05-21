enum FilterOperation {
  Equals = 'equals',
  NotEquals = 'notEquals',
  Contains = 'contains',
  NotContains = 'notContains',
  StartsWith = 'startsWith',
  EndsWith = 'endsWith',
  GreaterThan = 'greaterThan',
  GreaterThanOrEqual = 'greaterThanOrEqual',
  LessThan = 'lessThan',
  LessThanOrEqual = 'lessThanOrEqual',
  Between = 'between',
  BetweenInclusive = 'betweenInclusive',
  In = 'in',
  NotIn = 'notIn',
  IsNull = 'isNull',
  IsNotNull = 'isNotNull',
  IsEmpty = 'isEmpty',
  IsNotEmpty = 'isNotEmpty',
  LessThanField = 'lessThanField',
  GreaterThanField = 'greaterThanField',
  EqualField = 'equalField',
  NotEqualField = 'notEqualField',
  LessThanOrEqualToField = 'lessThanOrEqualToField',
  GreaterThanOrEqualToField = 'greaterThanOrEqualToField'
}

export default FilterOperation;
