// src/screens/DashboardScreen.tsx
import React, { useEffect, useState, useRef } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Animated,
  Dimensions,
  StatusBar
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import  api  from "../api/client";

interface Todo {
  id: number;
  title: string;
  is_completed: boolean;
  created_at: string;
  owner_id: number;
}

type Props = {
  setIsLoggedIn: (value: boolean) => void;
};

export default function DashboardScreen({ setIsLoggedIn }: Props) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    fetchTodos();
    // Start entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await api.get('/todos/');
      setTodos(response.data);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
      Alert.alert('Error', 'Failed to load todos');
    } finally {
      setLoading(false);
    }
  };

  const createTodo = async () => {
    if (!newTodo.trim()) {
      Alert.alert('✨ Oops!', 'Please enter a todo title to continue');
      return;
    }

    try {
      setCreating(true);
      const response = await api.post('/todos/create', {
        title: newTodo.trim(),
      });
      
      // Animate new todo addition
      const newTodoAnim = new Animated.Value(0);
      setTodos([response.data, ...todos]);
      setNewTodo("");
      
      Animated.spring(newTodoAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    } catch (error) {
      console.error('Failed to create todo:', error);
      Alert.alert('❌ Error', 'Failed to create todo');
    } finally {
      setCreating(false);
    }
  };

  const completeTodo = async (todoId: number) => {
    try {
      const response = await api.patch(`/todos/${todoId}/complete`);
      setTodos(todos.map(todo => 
        todo.id === todoId ? response.data : todo
      ));
    } catch (error) {
      console.error('Failed to complete todo:', error);
      Alert.alert('Error', 'Failed to complete todo');
    }
  };

  const editTodo = async (todoId: number) => {
    if (!editText.trim()) {
      Alert.alert('Error', 'Please enter a todo title');
      return;
    }

    try {
      const response = await api.patch(`/todos/${todoId}/edit`, {
        title: editText.trim(),
      });
      setTodos(todos.map(todo => 
        todo.id === todoId ? response.data : todo
      ));
      setEditingId(null);
      setEditText("");
    } catch (error) {
      console.error('Failed to edit todo:', error);
      Alert.alert('Error', 'Failed to edit todo');
    }
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.title);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditText("");
  };

  const animatePress = () => {
    // Simple press feedback without individual item animations
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const renderTodo = ({ item, index }: { item: Todo; index: number }) => {
    return (
      <Animated.View 
        style={[
          {
            opacity: fadeAnim,
          }
        ]}
      >
        <LinearGradient
          colors={item.is_completed 
            ? ['#d1f2eb', '#a3e4d7'] 
            : ['#ffffff', '#f8f9fa']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.todoItem, { marginTop: index === 0 ? 0 : 12 }]}
        >
          {editingId === item.id ? (
            <View style={styles.editContainer}>
              <TextInput
                style={styles.editInput}
                value={editText}
                onChangeText={setEditText}
                onSubmitEditing={() => editTodo(item.id)}
                autoFocus
                placeholder="✏️ Edit your todo..."
                placeholderTextColor="rgba(31, 30, 30, 0.7)"
              />
              <View style={styles.editButtons}>
                <TouchableOpacity 
                  style={styles.saveButton} 
                  onPress={() => editTodo(item.id)}
                >
                  <LinearGradient
                    colors={['#55a3ff', '#3742fa']}
                    style={styles.buttonGradient}
                  >
                    <Text style={styles.saveButtonText}>💾 Save</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.cancelButton} 
                  onPress={cancelEditing}
                >
                  <LinearGradient
                    colors={['#ff7675', '#fd79a8']}
                    style={styles.buttonGradient}
                  >
                    <Text style={styles.cancelButtonText}>❌ Cancel</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              <View style={styles.todoContent}>
                <Text style={[styles.todoText, item.is_completed && styles.todoTextCompleted]}>
                  {item.is_completed ? '✅ ' : '📝 '}{item.title}
                </Text>
                <Text style={styles.todoTime}>
                  {new Date(item.created_at).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.todoButtons}>
                {!item.is_completed && (
                  <TouchableOpacity 
                    style={styles.editActionButton} 
                    onPress={() => {
                      animatePress();
                      startEditing(item);
                    }}
                  >
                    <LinearGradient
                      colors={['#fdcb6e', '#f39c12']}
                      style={styles.smallButtonGradient}
                    >
                      <Text style={styles.editActionButtonText}>✏️</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
                <TouchableOpacity 
                  style={styles.completeButton} 
                  onPress={() => {
                    if (!item.is_completed) {
                      animatePress();
                      completeTodo(item.id);
                    }
                  }}
                >
                  <LinearGradient
                    colors={item.is_completed 
                      ? ['#00cec9', '#55a3ff'] 
                      : ['#a29bfe', '#6c5ce7']
                    }
                    style={styles.smallButtonGradient}
                  >
                    <Text style={styles.completeButtonText}>
                      {item.is_completed ? '✓' : '✓'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </>
          )}
        </LinearGradient>
      </Animated.View>
    );
  };

  if (loading) {
    return (
      <LinearGradient
        colors={['#ffecd2', '#f8e0d8ff']}
        style={styles.loadingContainer}
      >
        <StatusBar barStyle="light-content" />
        <Animated.View 
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }}
        >
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>✨ Loading your todos...</Text>
          <Text style={styles.loadingSubtext}>Getting everything ready!</Text>
        </Animated.View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#ffecd2', '#edc6b7ff', '#ffeaa7', '#fff5f5']}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" />
      
      <Animated.View 
        style={[
          styles.headerContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <Text style={styles.headerTitle}> My Todos</Text>
        <Text style={styles.headerSubtitle}>Stay organized, stay productive!</Text>
      </Animated.View>

      <Animated.View 
        style={[
          styles.inputContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
          style={styles.inputWrapper}
        >
          <TextInput
            style={styles.input}
            placeholder="✨ What needs to be done?"
            placeholderTextColor="rgba(30, 28, 28, 0.7)"
            value={newTodo}
            onChangeText={setNewTodo}
            onSubmitEditing={createTodo}
            returnKeyType="done"
          />
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={createTodo}
            disabled={creating}
          >
            <LinearGradient
              colors={['#db9396ff', '#e3a9d0ff', '#ffd7f2ff']}
              style={styles.addButtonGradient}
            >
              <Text style={styles.addButtonText}>
                {creating ? "⏳" : "➕"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>

      <Animated.View 
        style={[
          styles.listWrapper,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <FlatList
          data={todos}
          renderItem={renderTodo}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Animated.View style={{ opacity: fadeAnim }}>
              <LinearGradient
                colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                style={styles.emptyContainer}
              >
                <Text style={styles.emptyText}>
                  🎯 No todos yet!
                </Text>
                <Text style={styles.emptySubtext}>
                  Create your first todo above to get started
                </Text>
              </LinearGradient>
            </Animated.View>
          }
        />
      </Animated.View>
    </LinearGradient>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: '#2c3e50',
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  headerContainer: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    borderRadius: 25,
    padding: 4,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  input: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
    color: 'black',
    fontWeight: '500',
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  listWrapper: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listContainer: {
    paddingBottom: 100,
  },
  todoItem: {
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 6 },
    // shadowOpacity: 0.3,
    // shadowRadius: 12,
    // elevation: 10,
  },
  todoContent: {
    flex: 1,
    marginRight: 15,
  },
  todoText: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '600',
    marginBottom: 4,
  },
  todoTextCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.8,
  },
  todoTime: {
    fontSize: 12,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  todoButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  editActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  editActionButtonText: {
    fontSize: 16,
    textAlign: 'center',
  },
  completeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  completeButtonText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  smallButtonGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editContainer: {
    flex: 1,
  },
  editInput: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  editButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  saveButton: {
    flex: 1,
    borderRadius: 12,
  },
  cancelButton: {
    flex: 1,
    borderRadius: 12,
  },
  buttonGradient: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyContainer: {
    marginTop: 60,
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  emptyText: {
    fontSize: 24,
    color: '#2c3e50',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});