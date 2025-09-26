import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Calendar,
  User,
  Clock,
  ArrowRight,
  Search,
  Tag,
  TrendingUp,
  BookOpen,
  Share2,
  Eye,
  Heart,
} from 'lucide-react';
import { Card, Button, Badge, SearchBar, Pagination } from '../../components/ui';

export const Blog: React.FC = () => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'All Posts', count: 24 },
    { id: 'cashback-tips', name: 'Cashback Tips', count: 8 },
    { id: 'shopping-guides', name: 'Shopping Guides', count: 6 },
    { id: 'deals-alerts', name: 'Deal Alerts', count: 5 },
    { id: 'company-news', name: 'Company News', count: 3 },
    { id: 'tutorials', name: 'Tutorials', count: 2 },
  ];

  const featuredPost = {
    id: '1',
    title: 'How to Maximize Your Cashback Earnings in 2025',
    excerpt: 'Discover the latest strategies and tips to earn maximum cashback on every purchase. Learn from experts and boost your savings.',
    content: 'Complete guide to earning more cashback...',
    author: 'Sarah Johnson',
    authorAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    publishedAt: '2025-01-20T10:00:00Z',
    readTime: '8 min read',
    category: 'Cashback Tips',
    image: 'https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
    views: 2450,
    likes: 89,
    featured: true,
  };

  const blogPosts = [
    {
      id: '2',
      title: 'Top 10 Online Stores for Maximum Cashback',
      excerpt: 'Explore the best online stores that offer the highest cashback rates and exclusive deals.',
      author: 'Mike Chen',
      authorAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      publishedAt: '2025-01-18T14:30:00Z',
      readTime: '6 min read',
      category: 'Shopping Guides',
      image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
      views: 1890,
      likes: 67,
    },
    {
      id: '3',
      title: 'Festival Season Shopping: Best Deals and Offers',
      excerpt: 'Make the most of festival season with our curated list of best deals and cashback offers.',
      author: 'Priya Sharma',
      authorAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      publishedAt: '2025-01-15T09:15:00Z',
      readTime: '5 min read',
      category: 'Deal Alerts',
      image: 'https://images.pexels.com/photos/1303081/pexels-photo-1303081.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
      views: 3200,
      likes: 124,
    },
    {
      id: '4',
      title: 'Understanding Cashback: A Beginner\'s Guide',
      excerpt: 'New to cashback? Learn everything you need to know to start earning money on your purchases.',
      author: 'David Kumar',
      authorAvatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      publishedAt: '2025-01-12T16:45:00Z',
      readTime: '7 min read',
      category: 'Tutorials',
      image: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
      views: 1560,
      likes: 45,
    },
    {
      id: '5',
      title: 'Mobile Shopping vs Desktop: Which Offers Better Cashback?',
      excerpt: 'Compare mobile and desktop shopping experiences and find out which platform gives you better cashback rates.',
      author: 'Lisa Wong',
      authorAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      publishedAt: '2025-01-10T11:20:00Z',
      readTime: '4 min read',
      category: 'Cashback Tips',
      image: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
      views: 980,
      likes: 32,
    },
    {
      id: '6',
      title: 'SaveMoney App Update: New Features and Improvements',
      excerpt: 'Discover the latest features in our mobile app that make earning cashback even easier.',
      author: 'Tech Team',
      authorAvatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      publishedAt: '2025-01-08T13:00:00Z',
      readTime: '3 min read',
      category: 'Company News',
      image: 'https://images.pexels.com/photos/147413/twitter-facebook-together-exchange-of-information-147413.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
      views: 756,
      likes: 28,
    },
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === categories.find(cat => cat.id === selectedCategory)?.name;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              SaveMoney Blog
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Tips, guides, and insights to help you save more money
            </p>
            
            <div className="max-w-2xl mx-auto">
              <SearchBar
                placeholder="Search articles..."
                onSearch={setSearchQuery}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Post */}
        <section className="mb-16">
          <div className="flex items-center mb-8">
            <TrendingUp className="w-6 h-6 text-orange-500 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">Featured Article</h2>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="overflow-hidden" hover>
              <div className="lg:flex">
                <div className="lg:w-1/2">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-64 lg:h-full object-cover"
                  />
                </div>
                <div className="lg:w-1/2 p-8">
                  <div className="flex items-center mb-4">
                    <Badge variant="warning" size="sm">Featured</Badge>
                    <Badge variant="info" size="sm" className="ml-2">
                      {featuredPost.category}
                    </Badge>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {featuredPost.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <img
                        src={featuredPost.authorAvatar}
                        alt={featuredPost.author}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{featuredPost.author}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(featuredPost.publishedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {featuredPost.readTime}
                      </div>
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {featuredPost.views}
                      </div>
                      <div className="flex items-center">
                        <Heart className="w-4 h-4 mr-1" />
                        {featuredPost.likes}
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="primary" icon={ArrowRight} iconPosition="right">
                    Read Full Article
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </section>

        <div className="lg:flex lg:gap-12">
          {/* Main Content */}
          <div className="lg:w-2/3">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>

            {/* Blog Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="h-full"
                >
                  <Card className="overflow-hidden h-full flex flex-col" hover>
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                    
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center mb-3">
                        <Badge variant="secondary" size="sm">
                          {post.category}
                        </Badge>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 flex-1 line-clamp-3">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <img
                            src={post.authorAvatar}
                            alt={post.author}
                            className="w-8 h-8 rounded-full mr-2"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{post.author}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(post.publishedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3 text-xs text-gray-500">
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {post.readTime}
                          </div>
                          <div className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            {post.views}
                          </div>
                        </div>
                      </div>
                      
                      <Button variant="outline" size="sm" fullWidth>
                        Read More
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={1}
              totalPages={3}
              onPageChange={() => {}}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 mt-12 lg:mt-0">
            <div className="space-y-8">
              {/* Popular Posts */}
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Popular Posts
                </h3>
                <div className="space-y-4">
                  {blogPosts.slice(0, 3).map((post, index) => (
                    <div key={post.id} className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-semibold text-purple-600">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                          {post.title}
                        </h4>
                        <div className="flex items-center text-xs text-gray-500">
                          <Eye className="w-3 h-3 mr-1" />
                          {post.views} views
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Newsletter Signup */}
              <Card className="bg-gradient-to-br from-purple-50 to-blue-50">
                <div className="text-center">
                  <BookOpen className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Stay Updated
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Get the latest cashback tips and deals delivered to your inbox
                  </p>
                  <div className="space-y-3">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <Button variant="primary" size="sm" fullWidth>
                      Subscribe
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Tags */}
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Tag className="w-5 h-5 mr-2" />
                  Popular Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['Cashback', 'Shopping', 'Deals', 'Savings', 'Tips', 'Mobile', 'Fashion', 'Electronics'].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-purple-100 hover:text-purple-700 cursor-pointer transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};