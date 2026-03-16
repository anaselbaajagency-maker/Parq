import {
    Truck, Car, Bus, Bike, Hammer, Wrench, HardHat, Home, Building, Warehouse,
    Package, Box, Settings, Grid, Tag, Briefcase, Zap, Activity, Shield, Key,
    Lock, Phone, Mail, Calendar, Clock, MapPin, Navigation, Compass, Star, Heart,
    LayoutGrid, List, User, Users, Globe, Smartphone, Monitor, Cpu, Anchor,
    Ship, Plane, Train
} from 'lucide-react';
import styles from './iconPicker.module.css';

interface IconPickerProps {
    selectedIcon: string;
    onSelect: (iconName: string) => void;
    onClose: () => void;
}

const ICONS: Record<string, any> = {
    'truck': Truck,
    'car': Car,
    'bus': Bus,
    'bike': Bike,
    'hammer': Hammer,
    'wrench': Wrench,
    'hard-hat': HardHat,
    'home': Home,
    'building': Building,
    'warehouse': Warehouse,
    'package': Package,
    'box': Box,
    'settings': Settings,
    'grid': Grid,
    'layout-grid': LayoutGrid,
    'tag': Tag,
    'briefcase': Briefcase,
    'zap': Zap,
    'activity': Activity,
    'shield': Shield,
    'key': Key,
    'lock': Lock,
    'phone': Phone,
    'mail': Mail,
    'calendar': Calendar,
    'clock': Clock,
    'map-pin': MapPin,
    'navigation': Navigation,
    'compass': Compass,
    'star': Star,
    'heart': Heart,
    'list': List,
    'user': User,
    'users': Users,
    'globe': Globe,
    'smartphone': Smartphone,
    'monitor': Monitor,
    'cpu': Cpu,
    'anchor': Anchor,
    'ship': Ship,
    'plane': Plane,
    'train': Train
};

export default function IconPicker({ selectedIcon, onSelect, onClose }: IconPickerProps) {
    return (
        <div className={styles.pickerOverlay} onClick={onClose}>
            <div className={styles.pickerModel} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <h3>Choisir une icône</h3>
                    <button type="button" onClick={onClose} className={styles.closeBtn}>&times;</button>
                </div>
                <div className={styles.grid}>
                    {Object.entries(ICONS).map(([name, Icon]) => (
                        <button
                            key={name}
                            type="button"
                            className={`${styles.iconBtn} ${selectedIcon === name ? styles.active : ''}`}
                            onClick={() => {
                                onSelect(name);
                                onClose();
                            }}
                            title={name}
                        >
                            <Icon size={24} />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
