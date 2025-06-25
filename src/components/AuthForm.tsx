
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Brain, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface AuthFormProps {
  type: 'login' | 'signup';
}

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [mbti, setMbti] = useState('');
  const [university, setUniversity] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let result;
      
      if (type === 'login') {
        result = await login(email, password);
      } else {
        result = await signup(email, password, fullName, mbti, university);
      }

      if (!result.error) {
        toast({
          title: type === 'login' ? '登录成功！' : '注册成功！',
          description: type === 'login' ? '欢迎回到 TicketHub！' : '欢迎加入 TicketHub！',
        });
        navigate('/');
      } else {
        toast({
          title: "认证失败",
          description: result.error.message || "请检查您的信息并重试。",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "错误",
        description: "出现了一些问题，请重试。",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {type === 'login' ? '欢迎回来' : '加入 TicketHub'}
          </CardTitle>
          <CardDescription>
            {type === 'login' 
              ? '登录您的账户以继续' 
              : '创建您的账户开始购买门票'
            }
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {type === 'signup' && (
              <>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="姓名"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>

                <div className="relative">
                  <Brain className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="MBTI类型 (可选，如 INTJ 或其他想法)"
                    value={mbti}
                    onChange={(e) => setMbti(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="relative">
                  <GraduationCap className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="就读或有关系的大学/学院"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="email"
                placeholder="邮箱地址"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              {isLoading ? '处理中...' : (type === 'login' ? '登录' : '创建账户')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {type === 'login' 
                ? "还没有账户？ " 
                : "已有账户？ "
              }
              <Link
                to={type === 'login' ? '/signup' : '/login'}
                className="font-medium text-purple-600 hover:text-purple-500"
              >
                {type === 'login' ? '注册' : '登录'}
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;
