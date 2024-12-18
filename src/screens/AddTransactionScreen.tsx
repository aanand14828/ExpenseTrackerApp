import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { AppContext } from '../context/AppContext';
import { COLORS, SIZES } from '../constants/theme';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

// Import the polyfill BEFORE importing uuid
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { Ionicons } from '@expo/vector-icons';

export default function AddTransactionScreen() {
  const { addTransaction, categories } = useContext(AppContext);
  const navigation = useNavigation();

  const [type, setType] = useState<'income' | 'expense'>('expense');
  
  const currentCategories = categories[type] || [];
  const defaultCategory = currentCategories.length > 0 ? currentCategories[0] : '';
  
  const [category, setCategory] = useState(defaultCategory);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const onSave = () => {
    if (!amount || isNaN(Number(amount))) {
      Alert.alert("Validation", "Please enter a valid amount.");
      return;
    }

    if (!category) {
      Alert.alert("Validation", "Please select a category or add one first.");
      return;
    }

    const transaction = {
      id: uuidv4(),
      type,
      category,
      amount: parseFloat(amount),
      note,
      date: new Date().toISOString()
    };

    addTransaction(transaction);
    navigation.goBack();
  };

  const handleTypeSwitch = (newType: 'income' | 'expense') => {
    setType(newType);
    const newCat = categories[newType] && categories[newType].length > 0 ? categories[newType][0] : '';
    setCategory(newCat);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Transaction</Text>

      <Text style={styles.label}>Type</Text>
      <View style={styles.typeRow}>
        <TouchableOpacity
          style={[styles.typeButton, type === 'income' && styles.typeSelected]}
          onPress={() => handleTypeSwitch('income')}
        >
          <Ionicons name="arrow-up-circle" size={24} color={type === 'income' ? COLORS.success : COLORS.textSecondary} />
          <Text style={[styles.typeText, type === 'income' && styles.typeTextSelected]}>Income</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeButton, type === 'expense' && styles.typeSelected]}
          onPress={() => handleTypeSwitch('expense')}
        >
          <Ionicons name="arrow-down-circle" size={24} color={type === 'expense' ? COLORS.danger : COLORS.textSecondary} />
          <Text style={[styles.typeText, type === 'expense' && styles.typeTextSelected]}>Expense</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Category</Text>
      {currentCategories.length > 0 ? (
        <View style={styles.input}>
          <Picker
            selectedValue={category}
            onValueChange={(itemValue) => setCategory(itemValue)}
          >
            {currentCategories.map((cat) => (
              <Picker.Item label={cat} value={cat} key={cat} />
            ))}
          </Picker>
        </View>
      ) : (
        <Text style={styles.noCategoryText}>
          No categories available for {type}. Add one first in the Categories screen.
        </Text>
      )}

      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={styles.textInput}
        keyboardType="decimal-pad"
        value={amount}
        onChangeText={setAmount}
        placeholder="0.00"
        placeholderTextColor={COLORS.textSecondary}
      />

      <Text style={styles.label}>Note</Text>
      <TextInput
        style={styles.textInput}
        value={note}
        onChangeText={setNote}
        placeholder="Optional note"
        placeholderTextColor={COLORS.textSecondary}
      />

      <TouchableOpacity
        style={[styles.saveButton, (!category || !amount) && { backgroundColor: COLORS.border }]}
        onPress={onSave}
        disabled={!category || !amount}
      >
        <Text style={styles.saveText}>Save Transaction</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.padding,
    backgroundColor: COLORS.background
  },
  title: {
    fontSize: SIZES.h2,
    fontWeight: '600',
    marginBottom: SIZES.padding,
    color: COLORS.textPrimary
  },
  label: {
    marginTop: SIZES.base,
    marginBottom: SIZES.base,
    fontSize: SIZES.h3,
    color: COLORS.textPrimary
  },
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    padding: SIZES.base,
    fontSize: SIZES.h3,
    marginBottom: SIZES.base,
    color: COLORS.textPrimary
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.base,
    overflow: 'hidden'
  },
  typeRow: {
    flexDirection: 'row',
    marginBottom: SIZES.base
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.base,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: SIZES.base,
  },
  typeSelected: {
    borderColor: COLORS.accent,
  },
  typeText: {
    marginLeft: SIZES.base,
    fontSize: SIZES.h3,
    color: COLORS.textSecondary
  },
  typeTextSelected: {
    color: COLORS.textPrimary,
    fontWeight: '600'
  },
  noCategoryText: {
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginBottom: SIZES.base
  },
  saveButton: {
    backgroundColor: COLORS.accent,
    padding: SIZES.base,
    borderRadius: SIZES.radius,
    marginTop: SIZES.padding,
    alignItems: 'center'
  },
  saveText: {
    color: '#fff',
    fontSize: SIZES.h3,
    fontWeight: '600'
  }
});