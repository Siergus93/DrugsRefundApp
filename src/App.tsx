import data from 'data/data3.json'
import { ReactElement, useEffect, useMemo, useState } from 'react'
import {
  Button,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import Autocomplete from 'react-native-autocomplete-input'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

export type RowType = {
  activeSubstance: string
  nameFormAndDose: string
  contentsOfPackage: string
  gtinOrOtherId: string
  effectiveDateOfDecision: string
  decisionDuration: string
  limitGroup: string
  officialTradePrice: string
  wholesalePriceGross: string
  retailPrice: string
  fundingLimit: string
  scopeOfReimbursement: string
  scopeOfReimbursementBeyondRegistration: string
  paymentLevel: string
  amountOfSurcharge: string
}

const mapRefundDataRow = (row: any): RowType => {
  const activeSubstance = row['__EMPTY']
  const nameFormAndDose = row['__EMPTY_1']
  const contentsOfPackage = row['__EMPTY_2']

  const gtinOrOtherId = row['__EMPTY_3']
  const effectiveDateOfDecision = row['__EMPTY_4']
  const decisionDuration = row['__EMPTY_5']

  const limitGroup = row['__EMPTY_6']
  const officialTradePrice = row['__EMPTY_7']
  const wholesalePriceGross = row['__EMPTY_8']

  const retailPrice = row['__EMPTY_9']
  const fundingLimit = row['__EMPTY_10']
  const scopeOfReimbursement = row['__EMPTY_11']

  const scopeOfReimbursementBeyondRegistration = row['__EMPTY_12']
  const paymentLevel = row['__EMPTY_13']
  const amountOfSurcharge = row['__EMPTY_14']

  return {
    activeSubstance,
    nameFormAndDose,
    contentsOfPackage,
    gtinOrOtherId,
    effectiveDateOfDecision,
    decisionDuration,
    limitGroup,
    officialTradePrice,
    wholesalePriceGross,
    retailPrice,
    fundingLimit,
    scopeOfReimbursement,
    scopeOfReimbursementBeyondRegistration,
    paymentLevel,
    amountOfSurcharge
  }
}

const filterRefundDrugs = (drugsTable: RowType[], query: string): RowType[] => {
  return drugsTable.filter((drug) => {
    return drug.nameFormAndDose.includes(query)
  })
}

export default function App(): ReactElement {
  const [refundTable, setRefundTable] = useState<RowType[]>([])
  const [header, setHeader] = useState<RowType | undefined>(undefined)

  useEffect(() => {
    const refundTableWithHeader: any[] = data['A1']

    const [_header, ..._refundTableRaw] = refundTableWithHeader.map(mapRefundDataRow)

    setRefundTable(_refundTableRaw)
    setHeader(_header)
  }, [])

  const [query, setQuery] = useState('')
  const isLoading = !refundTable.length
  const queriedRefundDrugs = useMemo(() => {
    return filterRefundDrugs(refundTable, query)
  }, [refundTable, query])

  const suggestions: RowType[] = useMemo(
    () => (queriedRefundDrugs.length === 1 ? [] : queriedRefundDrugs),
    [queriedRefundDrugs, query]
  )

  const placeholder = isLoading ? 'Wczytywanie...' : 'Wpisz nazwę leku'

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {queriedRefundDrugs.length !== 1 && (
          <Autocomplete
            editable={!isLoading}
            autoCorrect={false}
            data={suggestions}
            value={query}
            onChangeText={setQuery}
            placeholder={placeholder}
            hideResults={query === ''}
            style={styles.autocomplete}
            flatListProps={{
              keyboardShouldPersistTaps: 'always',
              keyExtractor: (_, index) => index.toString(),
              renderItem: ({ item }) => (
                <TouchableOpacity onPress={() => setQuery(item.nameFormAndDose)}>
                  <Text style={styles.itemText}>{item.nameFormAndDose}</Text>
                </TouchableOpacity>
              )
            }}
          />
        )}

        {queriedRefundDrugs.length === 1 && (
          <SafeAreaView>
            <ScrollView style={styles.scrollView}>
              <Field
                name={header?.nameFormAndDose ?? ''}
                value={queriedRefundDrugs[0].nameFormAndDose}
              />
              <Field
                name={header?.activeSubstance ?? ''}
                value={queriedRefundDrugs[0].activeSubstance}
              />
              <Field name={header?.retailPrice ?? ''} value={queriedRefundDrugs[0].retailPrice} />
              <Field name={header?.paymentLevel ?? ''} value={queriedRefundDrugs[0].paymentLevel} />
              <Field
                name={header?.scopeOfReimbursement ?? ''}
                value={queriedRefundDrugs[0].scopeOfReimbursement}
              />
              <Field
                name={header?.scopeOfReimbursementBeyondRegistration ?? ''}
                value={queriedRefundDrugs[0].scopeOfReimbursementBeyondRegistration}
              />
            </ScrollView>
            <Button title="Wróć" onPress={() => setQuery('')} color="#A29CF4" />
          </SafeAreaView>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export type FieldProps = {
  name: string
  value: string
}

export function Field({ name, value }: FieldProps) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldName}>{name}</Text>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  fieldContainer: {
    marginVertical: 0,
    marginHorizontal: 0
  },
  fieldName: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    backgroundColor: '#A6A184'
  },
  fieldValue: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#B5B5B5'
  },
  container: {
    flex: 1,
    backgroundColor: '#E5E3F1',
    alignItems: 'center',
    justifyContent: 'center',
    //paddingVertical: 30,
    paddingHorizontal: 0,
    paddingVertical: StatusBar.currentHeight,
    color: '#A29CF4'
  },
  text: {
    marginBottom: 8
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10
  },
  itemText: {
    fontSize: 20,
    margin: 2
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16
  },
  title: {
    fontSize: 32
  },
  autocomplete: {
    minWidth: '100%'
  },
  scrollView: {
    backgroundColor: '#E5E3F1',
    marginHorizontal: 10
  }
})
