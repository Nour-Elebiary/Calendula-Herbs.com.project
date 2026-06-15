import React from 'react'
import {
  Mail, Phone, MessageCircle, MessageSquare, Send, Video,
  Headphones, Camera, Globe, ExternalLink, Users, Link, Shield,
  MapPin, Clock, ImageIcon, Share2, AtSign, Hash, UserPlus, Bell,
  Smartphone, Music, Award, Star, Heart,
  Info, HelpCircle, FileText, Search
} from 'lucide-react'

import {
  FaLinkedinIn, FaXTwitter, FaFacebookF, FaInstagram, FaYoutube,
  FaWhatsapp, FaTelegram, FaViber, FaSkype, FaWeixin,
  FaSignalMessenger, FaFacebookMessenger, FaLine, FaDiscord,
  FaTiktok, FaThreads, FaSnapchat, FaPinterest, FaReddit,
  FaGithub, FaDribbble, FaBehance, FaMedium, FaSpotify,
  FaEnvelope, FaPhone, FaGlobe, FaUsers
} from 'react-icons/fa6'

export const ICON_MAP: Record<string, React.ElementType> = {
  // Brand icons
  FaLinkedinIn, FaXTwitter, FaFacebookF, FaInstagram, FaYoutube,
  FaWhatsapp, FaTelegram, FaViber, FaSkype, FaWeixin,
  FaSignalMessenger, FaFacebookMessenger, FaLine, FaDiscord,
  FaTiktok, FaThreads, FaSnapchat, FaPinterest, FaReddit,
  FaGithub, FaDribbble, FaBehance, FaMedium, FaSpotify,
  FaEnvelope, FaPhone, FaGlobe, FaUsers,
  // Lucide icons
  Mail, Phone, MessageCircle, MessageSquare, Send, Video,
  Headphones, Camera, Globe, ExternalLink, Users, Link, Shield,
  MapPin, Clock, ImageIcon, Share2, AtSign, Hash, UserPlus, Bell,
  Smartphone, Music, Award, Star, Heart,
  Info, HelpCircle, FileText, Search,
}

export const ICON_CATEGORIES: { label: string; icons: string[] }[] = [
  {
    label: 'Brands',
    icons: ['FaLinkedinIn', 'FaXTwitter', 'FaFacebookF', 'FaInstagram', 'FaYoutube', 'FaWhatsapp', 'FaTelegram', 'FaViber', 'FaSkype', 'FaWeixin', 'FaSignalMessenger', 'FaFacebookMessenger', 'FaLine', 'FaDiscord', 'FaTiktok', 'FaThreads', 'FaSnapchat', 'FaPinterest', 'FaReddit', 'FaGithub', 'FaDribbble', 'FaBehance', 'FaMedium', 'FaSpotify']
  },
  {
    label: 'Contact',
    icons: ['FaEnvelope', 'FaPhone', 'Phone', 'Mail', 'Smartphone', 'MessageCircle', 'MessageSquare', 'Send', 'AtSign']
  },
  {
    label: 'Social & Web',
    icons: ['FaGlobe', 'FaUsers', 'Globe', 'ExternalLink', 'Share2', 'Users', 'Link', 'Hash']
  },
  {
    label: 'Media',
    icons: ['Camera', 'Video', 'Music', 'ImageIcon']
  },
  {
    label: 'Communication',
    icons: ['Headphones', 'Bell', 'MessageCircle', 'MessageSquare', 'Send', 'Video']
  },
  {
    label: 'Status & Info',
    icons: ['Info', 'HelpCircle', 'Shield', 'Award', 'Star', 'Heart']
  },
  {
    label: 'Location & Time',
    icons: ['MapPin', 'Clock', 'Globe']
  },
  {
    label: 'Documents',
    icons: ['FileText', 'Search']
  },
]

export const CONTACT_TYPE_ICONS: Record<string, string> = {
  EMAIL:     'FaEnvelope',
  PHONE:     'FaPhone',
  LINKEDIN:  'FaLinkedinIn',
  TWITTER:   'FaXTwitter',
  WHATSAPP:  'FaWhatsapp',
  FACEBOOK:  'FaFacebookF',
  INSTAGRAM: 'FaInstagram',
  OTHER:     'Link',
}

export const CONTACT_METHOD_ICONS: Record<string, string> = {
  whatsapp:  'FaWhatsapp',
  telegram:  'FaTelegram',
  viber:     'FaViber',
  skype:     'FaSkype',
  wechat:    'FaWeixin',
  signal:    'FaSignalMessenger',
  messenger: 'FaFacebookMessenger',
  line:      'FaLine',
  discord:   'FaDiscord',
  other:     'Link',
}

export function getIconComponent(name: string | null | undefined, fallback: React.ElementType = Link): React.ElementType {
  if (!name) return fallback
  return ICON_MAP[name] || fallback
}

export function getContactTypeIcon(type: string): React.ElementType {
  return getIconComponent(CONTACT_TYPE_ICONS[type], Link)
}

export function getContactMethodIcon(type: string): React.ElementType {
  return getIconComponent(CONTACT_METHOD_ICONS[type], Link)
}
