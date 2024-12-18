import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { AppContext } from '../context/AppContext';
import { COLORS, SIZES } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function BudgetsGoalsScreen() {
  const { categories, budgets, setBudget, savingsGoal, setSavingsGoal, transactions } = useContext(AppContext);
  const [newGoal, setNewGoal] = useState(savingsGoal.toString());

  const expenseCategories = categories.expense;
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, inc) => acc + inc.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, exp) => acc + exp.amount, 0);
  const totalSavings = totalIncome - totalExpense;

  const onSaveGoal = () => {
    const goal = parseFloat(newGoal);
    if (!isNaN(goal)) {
      setSavingsGoal(goal);
    }
  };

  const renderCategoryItem = ({ item }: { item: string }) => {
    const catBudget = budgets[item] || 0;
    const spent = transactions
      .filter(t => t.type === 'expense' && t.category === item)
      .reduce((sum, tx) => sum + tx.amount, 0);

    const progress = catBudget > 0 ? Math.min(spent / catBudget, 1) : 0;

    const iconName = getCategoryIcon(item);

    return (
      <View style={styles.budgetRow}>
        <View style={styles.categoryInfo}>
          <Ionicons name={iconName} size={24} color={COLORS.textPrimary} style={{marginRight:SIZES.base}}/>
          <Text style={styles.catName}>{item}</Text>
        </View>
        <View style={styles.budgetValueContainer}>
          <TextInput
            style={styles.budgetInput}
            defaultValue={catBudget.toString()}
            keyboardType="number-pad"
            onSubmitEditing={(e) => {
              const val = parseFloat(e.nativeEvent.text);
              if (!isNaN(val)) {
                setBudget(item, val);
              }
            }}
            placeholder="0"
            placeholderTextColor={COLORS.textSecondary}
          />
        </View>
        {catBudget > 0 && (
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, {width: `${progress * 100}%`}]}/>
          </View>
        )}
      </View>
    );
  };

  const ListHeader = () => (
    <View>
      <Text style={styles.screenTitle}>Budgets & Goals</Text>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Category Budgets</Text>
        {expenseCategories.length === 0 && (
          <Text style={styles.noCategoriesText}>No expense categories found. Please add categories first.</Text>
        )}
      </View>
    </View>
  );

  const ListFooter = () => {
    const goalProgress = savingsGoal > 0 ? Math.min(totalSavings / savingsGoal, 1) : 0;

    return (
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Savings Goal</Text>
        <View style={styles.savingsInfoRow}>
          <Text style={styles.infoLabel}>Current Savings:</Text>
          <Text style={styles.infoValue}>${totalSavings.toFixed(2)}</Text>
        </View>
        <View style={styles.savingsInfoRow}>
          <Text style={styles.infoLabel}>Current Goal:</Text>
          <Text style={styles.infoValue}>${savingsGoal.toFixed(2)}</Text>
        </View>
        <View style={styles.goalProgressContainer}>
          <View style={styles.goalProgressBar}>
            <View style={[styles.goalProgressFill, {width: `${goalProgress * 100}%`}]} />
          </View>
          <Text style={styles.goalProgressText}>
            {Math.round(goalProgress * 100)}%
          </Text>
        </View>
        <View style={styles.goalInputRow}>
          <TextInput
            style={styles.goalInput}
            value={newGoal}
            keyboardType="number-pad"
            onChangeText={setNewGoal}
            placeholder="Enter new goal"
            placeholderTextColor={COLORS.textSecondary}
          />
          <TouchableOpacity style={styles.saveButton} onPress={onSaveGoal}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={[ '#E0ECFF', '#FDFDFD']}
      style={{flex:1}}
    >
      <KeyboardAvoidingView
        style={{flex:1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          style={styles.container}
          data={expenseCategories}
          keyExtractor={(cat) => cat}
          renderItem={renderCategoryItem}
          ItemSeparatorComponent={() => <View style={styles.separator}/>}
          ListHeaderComponent={ListHeader}
          ListFooterComponent={ListFooter}
          ListEmptyComponent={null}
          contentContainerStyle={{ paddingBottom: SIZES.padding * 2 }}
        />
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

function getCategoryIcon(category: string) {
  const lower = category.toLowerCase();
  if (lower.includes('food') || lower.includes('restaurant')) return 'fast-food-outline';
  if (lower.includes('rent') || lower.includes('house') || lower.includes('home')) return 'home-outline';
  if (lower.includes('transport') || lower.includes('taxi') || lower.includes('uber')) return 'car-outline';
  if (lower.includes('shopping')) return 'cart-outline';
  return 'pricetag-outline';
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    padding: SIZES.padding
  },
  screenTitle: {
    fontSize: SIZES.h2,
    fontWeight: '800',
    marginBottom: SIZES.padding,
    color: COLORS.textPrimary
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2
  },
  sectionTitle: {
    fontSize: SIZES.h3,
    fontWeight: '700',
    marginBottom: SIZES.base,
    color: COLORS.textPrimary
  },
  noCategoriesText: {
    fontStyle:'italic',
    color: COLORS.textSecondary,
    textAlign:'center',
    paddingVertical: SIZES.base
  },
  budgetRow: {
    paddingVertical: SIZES.base,
  },
  categoryInfo: {
    flexDirection:'row',
    alignItems:'center',
    marginBottom: SIZES.base/2
  },
  catName: {
    fontSize: SIZES.h4,
    color: COLORS.textPrimary,
    fontWeight:'600'
  },
  budgetValueContainer: {
    flexDirection:'row',
    justifyContent:'flex-end',
    alignItems:'center',
    marginBottom: SIZES.base/2
  },
  budgetInput: {
    width: 80,
    borderWidth:1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    padding: SIZES.base,
    textAlign: 'right',
    color: COLORS.textPrimary,
    fontSize: SIZES.h4,
    backgroundColor: '#F9F9F9'
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SIZES.base
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4
  },
  progressBar: {
    height:8,
    borderRadius:4,
    backgroundColor: COLORS.accent
  },
  savingsInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: SIZES.base/2
  },
  infoLabel: {
    fontSize: SIZES.h4,
    color: COLORS.textSecondary
  },
  infoValue: {
    fontSize: SIZES.h4,
    fontWeight:'700',
    color: COLORS.textPrimary
  },
  goalProgressContainer: {
    flexDirection:'row',
    alignItems:'center',
    marginTop: SIZES.base
  },
  goalProgressBar: {
    flex:1,
    height:8,
    backgroundColor:'#E0E0E0',
    borderRadius:4,
    marginRight: SIZES.base
  },
  goalProgressFill: {
    height:8,
    borderRadius:4,
    backgroundColor: COLORS.success
  },
  goalProgressText: {
    fontSize: SIZES.h4,
    fontWeight:'600',
    color: COLORS.textPrimary,
    width:40,
    textAlign:'right'
  },
  goalInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.padding
  },
  goalInput: {
    flex:1,
    borderWidth:1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    padding: SIZES.base,
    fontSize: SIZES.h4,
    color: COLORS.textPrimary,
    marginRight: SIZES.base,
    backgroundColor:'#F9F9F9'
  },
  saveButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: SIZES.base,
    paddingHorizontal: SIZES.padding,
    borderRadius: SIZES.radius
  },
  saveText: {
    color:'#fff',
    fontSize: SIZES.h4,
    fontWeight:'600'
  }
});