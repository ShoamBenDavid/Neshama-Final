import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  I18nManager,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/StackNavigator';
import Screen from '../components/Screen';
import Text from '../components/Text';
import colors from '../config/colors';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { sendChatMessage, clearChat } from '../store/slices/chatSlice';

type ChatScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Chat'>;
};

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatScreen({ navigation }: ChatScreenProps) {
  const dispatch = useAppDispatch();
  const { messages, isLoading } = useAppSelector((state) => state.chat);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSend = () => {
    const text = inputText.trim();
    if (!text || isLoading) return;

    setInputText('');

    const history = messages.map((m: ChatMessage) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

    console.log('Sending chat message:', text, 'history length:', history.length);
    dispatch(sendChatMessage({ message: text, history }));
  };

  const renderMessage = (msg: ChatMessage) => {
    const isUser = msg.role === 'user';
    return (
      <View
        key={msg.id}
        style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.aiBubble,
        ]}
      >
        {!isUser && (
          <View style={styles.aiAvatar}>
            <MaterialCommunityIcons
              name="robot-outline"
              size={16}
              color={colors.primary}
            />
          </View>
        )}
        <View
          style={[
            styles.bubbleContent,
            isUser ? styles.userBubbleContent : styles.aiBubbleContent,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isUser ? styles.userMessageText : styles.aiMessageText,
            ]}
          >
            {msg.content}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <Screen style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <MaterialCommunityIcons
              name="arrow-right"
              size={24}
              color={colors.text.primary}
            />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <MaterialCommunityIcons
              name="robot-outline"
              size={24}
              color={colors.primary}
            />
            <Text style={styles.headerTitle}>NeshmaAI</Text>
          </View>
          <TouchableOpacity
            onPress={() => dispatch(clearChat())}
            style={styles.clearButton}
          >
            <MaterialCommunityIcons
              name="delete-outline"
              size={22}
              color={colors.text.secondary}
            />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          {/* Welcome message */}
          {messages.length === 0 && (
            <View style={styles.welcomeContainer}>
              <View style={styles.welcomeIcon}>
                <MaterialCommunityIcons
                  name="shield-check-outline"
                  size={48}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.welcomeTitle}>שלום, אני NeshmaAI</Text>
              <Text style={styles.welcomeSubtitle}>
                אני כאן כדי להקשיב ולתמוך בך. איך אני יכול לעזור לך היום?
              </Text>
            </View>
          )}

          {messages.map(renderMessage)}

          {isLoading && (
            <View style={[styles.messageBubble, styles.aiBubble]}>
              <View style={styles.aiAvatar}>
                <MaterialCommunityIcons
                  name="robot-outline"
                  size={16}
                  color={colors.primary}
                />
              </View>
              <View style={[styles.bubbleContent, styles.aiBubbleContent]}>
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="כתוב הודעה..."
            placeholderTextColor={colors.text.light}
            multiline
            maxLength={1000}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!inputText.trim() || isLoading) && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!inputText.trim() || isLoading}
          >
            <MaterialCommunityIcons
              name="send"
              size={20}
              color={colors.white}
              style={{ transform: [{ scaleX: -1 }] }}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  backButton: {
    padding: 8,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  clearButton: {
    padding: 8,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  welcomeContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  welcomeIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.lightPurple,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  messageBubble: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  userBubble: {
    justifyContent: 'flex-end',
  },
  aiBubble: {
    justifyContent: 'flex-start',
  },
  aiAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.lightPurple,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  bubbleContent: {
    maxWidth: '75%',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  userBubbleContent: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  aiBubbleContent: {
    backgroundColor: colors.cardBackground,
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'right',
  },
  userMessageText: {
    color: colors.white,
  },
  aiMessageText: {
    color: colors.text.primary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.cardBackground,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    gap: 8,
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: colors.gray[100],
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.text.primary,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.gray[300],
  },
});
