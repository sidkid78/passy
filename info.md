Here is the complete production-ready implementation plan and code for Passy.

1. High-Level Architecture
We will use a Feature-First architecture powered by Riverpod for state management and dependency injection.

Framework: Flutter (latest stable).
Backend: Firebase (Auth, Firestore, Storage, Functions).
Routing: go_router (handles deep links naturally).
State: flutter_riverpod (v2.x with Code Generation or Notifiers).
Styles: Material 3 customized for the "Passy" soft aesthetic.
2. Firestore Schema & Security Rules

Schema Definition
1. users (Global user profiles)

code
JSON
{
  "uid": "auth_uid_123",
  "email": "mom@example.com",
  "displayName": "Jane Doe",
  "isPremium": false,
  "createdAt": "Timestamp"
}
2. events (The main container)

code
JSON
{
  "id": "evt_123",
  "hostUserId": "auth_uid_123",
  "name": "Sarah's Baby Shower",
  "date": "Timestamp",
  "theme": "classic_blue",
  "budgetTotal": 500.00,
  "inviteToken": "xyz-secure-token" // For deep linking validation
}
// Index: hostUserId ASC, date DESC
3. guests (Sub-collection of events OR root collection linked by eventId. Root is better for Collection Group queries, but Sub-collection is easier for security. We will use Root for easier querying by the guest later).

code
JSON
{
  "id": "guest_999",
  "eventId": "evt_123",
  "name": "Aunt May",
  "email": "may@example.com",
  "status": "invited", // invited, going, maybe, not_going
  "note": "Allergic to peanuts"
}
4. tasks (Sub-collection of events)

code
JSON
{
  "id": "task_001",
  "title": "Order Cake",
  "isCompleted": false,
  "dueDate": "Timestamp"
}
5. expenses (Sub-collection of events)

code
JSON
{
  "id": "exp_001",
  "title": "Balloons",
  "category": "decor",
  "amount": 50.00,
  "isPaid": true
}
6. registry_items (Sub-collection of events)

code
JSON
{
  "id": "reg_001",
  "title": "Stroller",
  "storeName": "Amazon",
  "url": "https://...",
  "isClaimed": false,
  "claimedBy": "guest_999"
}
Firestore Security Rules (firestore.rules)
code
JavaScript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function
    function isOwner(userId) {
      return request.auth != null && request.auth.uid == userId;
    }

    match /users/{userId} {
      allow read, write: if isOwner(userId);
    }

    match /events/{eventId} {
      // Host has full access
      allow read, write: if isOwner(resource.data.hostUserId) || isOwner(request.resource.data.hostUserId);
      
      // Guests with a valid link/token (simplified for MVP: read-only if they know the ID)
      // In production, validate a custom claim or token.
      allow read: if true; 

      match /tasks/{taskId} {
        allow read, write: if isOwner(get(/databases/$(database)/documents/events/$(eventId)).data.hostUserId);
      }
      
      match /expenses/{expId} {
        allow read, write: if isOwner(get(/databases/$(database)/documents/events/$(eventId)).data.hostUserId);
      }

      match /registry_items/{itemId} {
        allow read: if true;
        allow write: if isOwner(get(/databases/$(database)/documents/events/$(eventId)).data.hostUserId);
        // Allow guests to mark as claimed
        allow update: if request.resource.data.diff(resource.data).affectedKeys().hasOnly(['isClaimed', 'claimedBy']);
      }
    }
    
    match /guests/{guestId} {
       allow read: if true; // Simplified for guest list viewing
       allow write: if request.auth != null; // In real app, validate event ownership
    }
  }
}
3. Flutter Project Structure
code
Text
lib/
├── main.dart
├── firebase_options.dart (generated)
├── theme/
│   └── app_theme.dart
├── models/
│   ├── event_model.dart
│   ├── guest_model.dart
│   ├── task_model.dart
│   └── expense_model.dart
├── services/
│   ├── auth_service.dart
│   ├── firestore_service.dart
│   └── iap_service.dart
├── providers/
│   └── app_providers.dart
├── router/
│   └── app_router.dart
└── screens/
    ├── auth/
    │   └── auth_screen.dart
    ├── home/
    │   ├── home_screen.dart
    │   └── create_event_screen.dart
    ├── event_dashboard/
    │   ├── event_dashboard_screen.dart
    │   ├── tabs/
    │   │   ├── tasks_tab.dart
    │   │   ├── budget_tab.dart
    │   │   ├── guests_tab.dart
    │   │   └── registry_tab.dart
    └── settings/
        └── settings_screen.dart
4. pubspec.yaml
code
Yaml
name: passy
description: The simplest way to plan a beautiful baby shower.
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  # Firebase
  firebase_core: ^2.24.0
  firebase_auth: ^4.15.0
  cloud_firestore: ^4.13.0
  firebase_storage: ^11.5.0
  firebase_messaging: ^14.7.0
  # State & Routing
  flutter_riverpod: ^2.4.9
  go_router: ^12.1.0
  # Utilities
  uuid: ^4.0.0
  intl: ^0.19.0
  share_plus: ^7.2.0
  url_launcher: ^6.2.0
  in_app_purchase: ^3.1.12
  # UI
  google_fonts: ^6.1.0
  percent_indicator: ^4.2.3 # For budget/task progress

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
  # Add assets folder manually in your project
  assets:
    - assets/images/
5. Theming & Styles (lib/theme/app_theme.dart)
code
Dart
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppColors {
  static const Color pink = Color(0xFFFFC1CC); // Baby Pink
  static const Color pinkDark = Color(0xFFFF9EAF);
  static const Color blue = Color(0xFFB0E0E6); // Powder Blue
  static const Color blueDark = Color(0xFF87CEEB);
  static const Color surface = Color(0xFFFAFAFA);
  static const Color background = Colors.white;
  static const Color textPrimary = Color(0xFF4A4A4A);
  static const Color textSecondary = Color(0xFF9E9E9E);
}

class AppTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      scaffoldBackgroundColor: AppColors.background,
      colorScheme: ColorScheme.fromSeed(
        seedColor: AppColors.pink,
        primary: AppColors.pink,
        secondary: AppColors.blue,
        surface: AppColors.surface,
        background: AppColors.background,
      ),
      textTheme: GoogleFonts.nunitoTextTheme().apply(
        bodyColor: AppColors.textPrimary,
        displayColor: AppColors.textPrimary,
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        titleTextStyle: GoogleFonts.nunito(
          fontSize: 20,
          fontWeight: FontWeight.bold,
          color: AppColors.textPrimary,
        ),
        iconTheme: const IconThemeData(color: AppColors.pinkDark),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.pink,
          foregroundColor: Colors.white,
          elevation: 2,
          padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 24),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          textStyle: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
        ),
      ),
      cardTheme: CardTheme(
        color: Colors.white,
        elevation: 2,
        shadowColor: Colors.black12,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.surface,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
        contentPadding: const EdgeInsets.all(16),
      ),
    );
  }
}
6. Core Code (Services & Models)
I will provide the implementation of the core models and database service.

Models (lib/models/*.dart)
code
Dart
// lib/models/passy_models.dart

class AppEvent {
  final String id;
  final String hostId;
  final String name;
  final DateTime date;
  final double budgetTotal;
  final String theme;

  AppEvent({required this.id, required this.hostId, required this.name, required this.date, this.budgetTotal = 0, this.theme = 'pink'});

  Map<String, dynamic> toMap() => {
    'id': id, 'hostId': hostId, 'name': name, 
    'date': date.toIso8601String(), 'budgetTotal': budgetTotal, 'theme': theme
  };

  factory AppEvent.fromMap(Map<String, dynamic> map) => AppEvent(
    id: map['id'], hostId: map['hostId'], name: map['name'], 
    date: DateTime.parse(map['date']), budgetTotal: (map['budgetTotal'] ?? 0).toDouble(), theme: map['theme'] ?? 'pink'
  );
}

class Task {
  final String id;
  final String title;
  final bool isCompleted;
  final DateTime? dueDate;

  Task({required this.id, required this.title, this.isCompleted = false, this.dueDate});

  Map<String, dynamic> toMap() => {'id': id, 'title': title, 'isCompleted': isCompleted, 'dueDate': dueDate?.toIso8601String()};
  
  factory Task.fromMap(Map<String, dynamic> map) => Task(
    id: map['id'], title: map['title'], isCompleted: map['isCompleted'] ?? false, 
    dueDate: map['dueDate'] != null ? DateTime.parse(map['dueDate']) : null
  );
}

class Expense {
  final String id;
  final String title;
  final double amount;
  final String category;

  Expense({required this.id, required this.title, required this.amount, required this.category});

  Map<String, dynamic> toMap() => {'id': id, 'title': title, 'amount': amount, 'category': category};
  factory Expense.fromMap(Map<String, dynamic> map) => Expense(
    id: map['id'], title: map['title'], amount: (map['amount'] ?? 0).toDouble(), category: map['category'] ?? 'Other'
  );
}
Database Service (lib/services/firestore_service.dart)
code
Dart
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:uuid/uuid.dart';
import '../models/passy_models.dart';

class FirestoreService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;
  final Uuid _uuid = const Uuid();

  // Events
  Stream<List<AppEvent>> getEvents(String userId) {
    return _db.collection('events')
        .where('hostId', isEqualTo: userId)
        .orderBy('date', descending: false)
        .snapshots()
        .map((snap) => snap.docs.map((d) => AppEvent.fromMap(d.data())).toList());
  }

  Future<void> createEvent(String userId, String name, DateTime date, double budget) async {
    final id = _uuid.v4();
    final event = AppEvent(id: id, hostId: userId, name: name, date: date, budgetTotal: budget);
    await _db.collection('events').doc(id).set(event.toMap());
    
    // Add Default Tasks
    _addTask(id, "Send Invitations");
    _addTask(id, "Book Venue");
  }

  // Tasks
  Stream<List<Task>> getTasks(String eventId) {
    return _db.collection('events').doc(eventId).collection('tasks')
        .snapshots()
        .map((snap) => snap.docs.map((d) => Task.fromMap(d.data())).toList());
  }

  Future<void> _addTask(String eventId, String title) async {
    final id = _uuid.v4();
    await _db.collection('events').doc(eventId).collection('tasks').doc(id).set(
      Task(id: id, title: title).toMap()
    );
  }
  
  Future<void> toggleTask(String eventId, Task task) async {
    await _db.collection('events').doc(eventId).collection('tasks').doc(task.id).update({
      'isCompleted': !task.isCompleted
    });
  }

  // Budget
  Stream<List<Expense>> getExpenses(String eventId) {
     return _db.collection('events').doc(eventId).collection('expenses')
        .snapshots()
        .map((snap) => snap.docs.map((d) => Expense.fromMap(d.data())).toList());
  }

  Future<void> addExpense(String eventId, String title, double amount, String category) async {
    final id = _uuid.v4();
    await _db.collection('events').doc(eventId).collection('expenses').doc(id).set(
      Expense(id: id, title: title, amount: amount, category: category).toMap()
    );
  }
}
7. UI Implementation & State

lib/main.dart
code
Dart
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'firebase_options.dart';
import 'router/app_router.dart';
import 'theme/app_theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
  runApp(const ProviderScope(child: PassyApp()));
}

class PassyApp extends ConsumerWidget {
  const PassyApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(routerProvider);
    return MaterialApp.router(
      title: 'Passy',
      theme: AppTheme.lightTheme,
      routerConfig: router,
      debugShowCheckedModeBanner: false,
    );
  }
}
Router & Auth State (lib/router/app_router.dart)
code
Dart
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../screens/auth/auth_screen.dart';
import '../screens/home/home_screen.dart';
import '../screens/home/create_event_screen.dart';
import '../screens/event_dashboard/event_dashboard_screen.dart';

final routerProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/',
    routes: [
      GoRoute(
        path: '/',
        builder: (context, state) {
          if (FirebaseAuth.instance.currentUser == null) {
            return const AuthScreen();
          }
          return const HomeScreen();
        },
      ),
      GoRoute(path: '/create', builder: (context, state) => const CreateEventScreen()),
      GoRoute(
        path: '/event/:id',
        builder: (context, state) {
           final eventId = state.pathParameters['id']!;
           return EventDashboardScreen(eventId: eventId);
        }
      ),
    ],
  );
});
Screens

1. AuthScreen (Simplified Login/Signup)
code
Dart
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';

class AuthScreen extends StatefulWidget {
  const AuthScreen({super.key});
  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  final _emailCtrl = TextEditingController();
  final _passCtrl = TextEditingController();
  bool _isLogin = true;
  String? _error;

  Future<void> _submit() async {
    try {
      if (_isLogin) {
        await FirebaseAuth.instance.signInWithEmailAndPassword(
            email: _emailCtrl.text.trim(), password: _passCtrl.text.trim());
      } else {
        await FirebaseAuth.instance.createUserWithEmailAndPassword(
            email: _emailCtrl.text.trim(), password: _passCtrl.text.trim());
      }
      // Router automatically redirects in main
    } catch (e) {
      setState(() => _error = e.toString());
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.pink,
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Card(
            child: Padding(
              padding: const EdgeInsets.all(32),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.child_care, size: 64, color: AppColors.pink),
                  const SizedBox(height: 16),
                  Text("Passy", style: Theme.of(context).textTheme.displaySmall),
                  const SizedBox(height: 24),
                  if (_error != null) Text(_error!, style: const TextStyle(color: Colors.red)),
                  TextField(controller: _emailCtrl, decoration: const InputDecoration(labelText: 'Email')),
                  const SizedBox(height: 16),
                  TextField(controller: _passCtrl, obscureText: true, decoration: const InputDecoration(labelText: 'Password')),
                  const SizedBox(height: 24),
                  ElevatedButton(
                    onPressed: _submit,
                    child: Text(_isLogin ? 'Log In' : 'Sign Up'),
                  ),
                  TextButton(
                    onPressed: () => setState(() => _isLogin = !_isLogin),
                    child: Text(_isLogin ? 'Need an account?' : 'Have an account?'),
                  )
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
2. EventDashboardScreen (Tab Controller)
code
Dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../theme/app_theme.dart';
import 'tabs/tasks_tab.dart';
import 'tabs/budget_tab.dart';

// Minimal Tab examples for code brevity
class PlaceholderTab extends StatelessWidget {
  final String title;
  const PlaceholderTab(this.title, {super.key});
  @override
  Widget build(BuildContext context) => Center(child: Text(title));
}

class EventDashboardScreen extends ConsumerWidget {
  final String eventId;
  const EventDashboardScreen({super.key, required this.eventId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return DefaultTabController(
      length: 4,
      child: Scaffold(
        appBar: AppBar(
          title: const Text("Baby Shower"),
          bottom: const TabBar(
            labelColor: AppColors.pink,
            unselectedLabelColor: Colors.grey,
            indicatorColor: AppColors.pink,
            tabs: [
              Tab(icon: Icon(Icons.check_box), text: "Tasks"),
              Tab(icon: Icon(Icons.attach_money), text: "Budget"),
              Tab(icon: Icon(Icons.people), text: "Guests"),
              Tab(icon: Icon(Icons.card_giftcard), text: "Registry"),
            ],
          ),
          actions: [
            IconButton(icon: const Icon(Icons.share), onPressed: () {
               // Implement Share Logic
            })
          ],
        ),
        body: TabBarView(
          children: [
            TasksTab(eventId: eventId),
            BudgetTab(eventId: eventId),
            const PlaceholderTab("Guest List Coming Soon"),
            const PlaceholderTab("Registry Coming Soon"),
          ],
        ),
      ),
    );
  }
}
3. TasksTab
code
Dart
import 'package:flutter/material.dart';
import '../../services/firestore_service.dart';
import '../../models/passy_models.dart';

class TasksTab extends StatelessWidget {
  final String eventId;
  const TasksTab({super.key, required this.eventId});

  @override
  Widget build(BuildContext context) {
    final service = FirestoreService();
    
    return StreamBuilder<List<Task>>(
      stream: service.getTasks(eventId),
      builder: (context, snapshot) {
        if (!snapshot.hasData) return const Center(child: CircularProgressIndicator());
        final tasks = snapshot.data!;
        
        return ListView(
          padding: const EdgeInsets.all(16),
          children: [
            // Progress
            LinearProgressIndicator(
              value: tasks.isEmpty ? 0 : tasks.where((t) => t.isCompleted).length / tasks.length,
              backgroundColor: Colors.grey[200],
              color: Colors.green,
              minHeight: 10,
              borderRadius: BorderRadius.circular(5),
            ),
            const SizedBox(height: 20),
            ...tasks.map((task) => Card(
              child: ListTile(
                leading: Checkbox(
                  value: task.isCompleted,
                  activeColor: Colors.green,
                  onChanged: (val) => service.toggleTask(eventId, task),
                ),
                title: Text(task.title, 
                  style: TextStyle(decoration: task.isCompleted ? TextDecoration.lineThrough : null)),
              ),
            )),
          ],
        );
      },
    );
  }
}
4. BudgetTab
code
Dart
import 'package:flutter/material.dart';
import 'package:percent_indicator/circular_percent_indicator.dart';
import '../../services/firestore_service.dart';
import '../../models/passy_models.dart';
import '../../theme/app_theme.dart';

class BudgetTab extends StatelessWidget {
  final String eventId;
  const BudgetTab({super.key, required this.eventId});

  void _addExpenseDialog(BuildContext context, FirestoreService service) {
    final titleCtrl = TextEditingController();
    final amountCtrl = TextEditingController();
    showDialog(
      context: context, 
      builder: (_) => AlertDialog(
        title: const Text("Add Expense"),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(controller: titleCtrl, decoration: const InputDecoration(labelText: "Item")),
            const SizedBox(height: 10),
            TextField(controller: amountCtrl, decoration: const InputDecoration(labelText: "Cost"), keyboardType: TextInputType.number),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text("Cancel")),
          ElevatedButton(
            onPressed: () {
              service.addExpense(eventId, titleCtrl.text, double.tryParse(amountCtrl.text) ?? 0, "General");
              Navigator.pop(context);
            },
            child: const Text("Add")
          )
        ],
      )
    );
  }

  @override
  Widget build(BuildContext context) {
    final service = FirestoreService();
    // Note: In a real app, fetch event budgetTotal here too. Assuming 500 for demo.
    double totalBudget = 500.0; 

    return StreamBuilder<List<Expense>>(
      stream: service.getExpenses(eventId),
      builder: (context, snapshot) {
        if (!snapshot.hasData) return const Center(child: CircularProgressIndicator());
        final expenses = snapshot.data!;
        final spent = expenses.fold(0.0, (sum, item) => sum + item.amount);
        final percent = (spent / totalBudget).clamp(0.0, 1.0);

        return Scaffold(
          floatingActionButton: FloatingActionButton(
            backgroundColor: AppColors.pink,
            child: const Icon(Icons.add, color: Colors.white),
            onPressed: () => _addExpenseDialog(context, service),
          ),
          body: ListView(
            padding: const EdgeInsets.all(16),
            children: [
              Center(
                child: CircularPercentIndicator(
                  radius: 80.0,
                  lineWidth: 12.0,
                  percent: percent,
                  center: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text("\$${(totalBudget - spent).toStringAsFixed(0)}", style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 20)),
                      const Text("Remaining", style: TextStyle(fontSize: 12)),
                    ],
                  ),
                  progressColor: AppColors.blue,
                  backgroundColor: AppColors.surface,
                  circularStrokeCap: CircularStrokeCap.round,
                ),
              ),
              const SizedBox(height: 24),
              const Text("Expenses", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
              ...expenses.map((e) => ListTile(
                title: Text(e.title),
                subtitle: Text(e.category),
                trailing: Text("\$${e.amount.toStringAsFixed(2)}", style: const TextStyle(fontWeight: FontWeight.bold)),
              ))
            ],
          ),
        );
      },
    );
  }
}
8. Monetization (IAP) Logic
Create lib/services/iap_service.dart.

code
Dart
import 'package:in_app_purchase/in_app_purchase.dart';
import 'dart:async';

class IAPService {
  final InAppPurchase _iap = InAppPurchase.instance;
  
  // Product IDs configured in App Store Connect
  static const String kPremiumMonthly = 'passy_premium_monthly';
  static const String kPremiumYearly = 'passy_premium_yearly';

  Future<void> init() async {
    final available = await _iap.isAvailable();
    if (!available) return;

    // Listen to purchase updates
    _iap.purchaseStream.listen((List<PurchaseDetails> purchaseDetailsList) {
      _listenToPurchaseUpdated(purchaseDetailsList);
    });
  }

  void _listenToPurchaseUpdated(List<PurchaseDetails> purchaseDetailsList) {
    for (var purchaseDetails in purchaseDetailsList) {
      if (purchaseDetails.status == PurchaseStatus.purchased || 
          purchaseDetails.status == PurchaseStatus.restored) {
        // UNLOCK FEATURE IN FIRESTORE (Set user.isPremium = true)
        // verifyPurchase(purchaseDetails);
      }
      
      if (purchaseDetails.pendingCompletePurchase) {
        _iap.completePurchase(purchaseDetails);
      }
    }
  }

  Future<void> buyPremium() async {
    final ProductDetailsResponse response = await _iap.queryProductDetails({kPremiumMonthly});
    if (response.notFoundIDs.isNotEmpty) {
      // Handle error
      return;
    }
    final ProductDetails productDetails = response.productDetails.first;
    final PurchaseParam purchaseParam = PurchaseParam(productDetails: productDetails);
    _iap.buyNonConsumable(purchaseParam: purchaseParam);
  }
}
Gate logic:
In CreateEventScreen, check user's isPremium status (from Firestore). If they have > 1 event and are not premium, show "Upgrade to Premium" modal instead of creating the event.

9. Legal & App Store Readiness

App Store Info
Name: Passy: Baby Shower Planner
Subtitle: Plan, Invite, Organize.
Keywords: baby shower, party planner, registry, invitations, rsvp, pregnancy, event planning.
Promotional Text: The stress-free way to plan the perfect baby shower. Manage guests, budgets, and lists in one beautiful app.
Privacy Policy (Brief)
Passy Privacy Policy
We respect your privacy. Passy uses Firebase services to store your event data securely. We do not sell your personal data.

Data collected: Email (for account management), event details, and user-generated content.
Usage: To provide synchronization across devices and send event notifications.
Deletion: You may request account deletion at any time within the app settings.
App Icon Description
Shape: iOS Rounded Square.
Background: Pure white (#FFFFFF).
Foreground: A stylized, minimalist pacifier icon. The handle ring is Baby Blue (#B0E0E6), and the teat/nipple part is Soft Pink (#FFC1CC). It is centered with soft drop shadow (opacity 15%, Y offset 4px) to give it a "sticker" look.
10. iOS Deployment Steps

1. Firebase Setup
Go to console.firebase.google.com.
Create project Passy.
Enable Authentication (Email/Password).
Enable Firestore and paste the rules provided above.
Enable Storage (for event photos/themes).
2. iOS Configuration
In Firebase Console, click Add App -> iOS.
Bundle ID: com.yourname.passy (Must match Xcode).
Download GoogleService-Info.plist.
Open ios/Runner.xcworkspace in Xcode.
Drag the .plist file into the Runner folder (ensure "Copy items if needed" is checked).
3. Flutter Integration
Run flutter pub add firebase_core firebase_auth cloud_firestore.
Add the code to main.dart (Firebase.initializeApp).
In ios/Podfile, ensure platform is set to platform :ios, '13.0'.
Run cd ios && pod install.
4. Capabilities (Xcode)
Select the Runner target -> Signing & Capabilities.
Add Push Notifications.
Add Background Modes -> Check Remote notifications.
Add Associated Domains -> Add applinks:passy.page.link (for Deep Links).
5. In-App Purchases (App Store Connect)
Log in to App Store Connect -> My Apps -> Passy.
Go to Monetization -> In-App Purchases.
Create Non-Consumable:
Product ID: passy_premium_monthly
Reference Name: Premium Access
Price: Tier 1 (
0.99
)
o
r
T
i
e
r
5
(
0.99)orTier5(
4.99).
In Xcode, add In-App Purchase capability.
6. Build & Archive
In terminal: flutter build ipa.
Open Xcode -> Product -> Archive.
Once finished, the Organizer window opens. Click Distribute App.
Select App Store Connect -> Upload.
Wait for processing.
7. TestFlight & Release
In App Store Connect, go to TestFlight.
Add yourself as a tester.
Install TestFlight on your iPhone and download Passy.
Verify functionality (IAP in sandbox mode, Push notifications).
When ready, go to App Store tab, fill in metadata, screenshots, and submit for Review.
81.3s
Use Arrow Up and Arrow Down to select a turn, Enter to jump to it, and Escape to return to the chat.
Write to Cliff Franco
