class Wallet {
  final int balance;
  final String? currencyLabel;
  final String? formattedBalance;

  Wallet({required this.balance, this.currencyLabel, this.formattedBalance});

  factory Wallet.fromJson(Map<String, dynamic> json) {
    return Wallet(
      balance: json['balance'],
      currencyLabel: json['currency_label'],
      formattedBalance: json['formatted_balance'],
    );
  }
}

class Transaction {
  final int id;
  final int amount;
  final String? formattedAmount;
  final String type;
  final String? typeLabel;
  final String? description;
  final DateTime createdAt;

  Transaction({
    required this.id,
    required this.amount,
    this.formattedAmount,
    required this.type,
    this.typeLabel,
    this.description,
    required this.createdAt,
  });

  factory Transaction.fromJson(Map<String, dynamic> json) {
    return Transaction(
      id: json['id'],
      amount: json['amount'],
      formattedAmount: json['formatted_amount'],
      type: json['type'],
      typeLabel: json['type_label'],
      description: json['description'],
      createdAt: DateTime.parse(json['created_at']),
    );
  }
}
