import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { Popup, Cell } from '@nutui/nutui-react-taro'
import { ArrowRight } from '@nutui/icons-react-taro'
import './index.scss'

import type { CascaderOption as NutCascaderOption } from '@nutui/nutui-react-taro'

interface CascaderOption {
  value?: string | number
  text: string
  leaf?: boolean
  children?: CascaderOption[]
}

interface CustomCascaderProps {
  visible: boolean
  title?: string
  options?: CascaderOption[][]
  defaultValue?: (string | number)[]
  closeable?: boolean
  lazy?: boolean
  onClose: () => void
  onChange: (value: any, path: any) => void
  onLoad?: (node: NutCascaderOption, level: number) => Promise<NutCascaderOption[]>
}

export default function CustomCascader(props: CustomCascaderProps) {
  const {
    visible,
    title = '请选择',
    defaultValue = [],
    closeable = true,
    lazy = false,
    onClose,
    onChange,
    onLoad
  } = props

  const [activeTab, setActiveTab] = useState(0)
  const [tabsData, setTabsData] = useState<CascaderOption[][]>([])
  const [selectedPath, setSelectedPath] = useState<CascaderOption[]>([])
  const [loading, setLoading] = useState(false)

  // 初始化数据
  useEffect(() => {
    if (visible) {
      // 重置状态
      setActiveTab(0)
      setTabsData([])
      setSelectedPath([])
      
      if (lazy && onLoad) {
        // console.log('CustomCascader: 初始化数据加载')
        // 创建一个空的节点对象来模拟初始状态
        const emptyNode = {
          value: undefined,
          text: '',
          leaf: false
        } as NutCascaderOption
        loadData(emptyNode, 0)
      }
    }
  }, [visible])

  const loadData = async (node: NutCascaderOption | null, level: number) => {
    if (!onLoad) {
    //   console.log('CustomCascader: onLoad 函数不存在')
      return
    }
    
    // console.log('CustomCascader: 开始加载数据', { node, level })
    setLoading(true)
    try {
      const data = await onLoad(node as any, level)
    //   console.log('CustomCascader: 数据加载成功', data)
      
      // 转换数据格式以匹配内部使用的格式
      const convertedData: CascaderOption[] = data.map(item => ({
        value: item.value || '',
        text: item.text || '',
        leaf: item.leaf || false,
        children: item.children as CascaderOption[]
      }))
      
    //   console.log('CustomCascader: 转换后的数据', convertedData)
      
      const newTabsData = [...tabsData]
      newTabsData[level] = convertedData
      // 清除后续层级的数据
      newTabsData.splice(level + 1)
      setTabsData(newTabsData)
      
    //   console.log('CustomCascader: 更新 tabsData', newTabsData)
    } catch (error) {
      console.error('CustomCascader: 加载数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleItemClick = async (item: CascaderOption, level: number) => {
    const newSelectedPath = [...selectedPath]
    newSelectedPath[level] = item
    // 清除后续层级的选择
    newSelectedPath.splice(level + 1)
    setSelectedPath(newSelectedPath)

    // 如果是叶子节点或者已经是最后一层
    if (item.leaf) {
      // 触发onChange事件
      const values = newSelectedPath.map(pathItem => pathItem.value)
      onChange(values, newSelectedPath)
      onClose()
      return
    }

    // 如果是懒加载模式，加载下一层数据
    if (lazy && onLoad) {
      await loadData(item, level + 1)
      setActiveTab(level + 1)
    } else if (item.children) {
      // 静态数据模式
      const newTabsData = [...tabsData]
      newTabsData[level + 1] = item.children
      setTabsData(newTabsData)
      setActiveTab(level + 1)
    }
  }

  const handleTabClick = (index: number) => {
    setActiveTab(index)
  }

  return (
    <Popup
      visible={visible}
      position="bottom"
      closeable={closeable}
      onClose={onClose}
      style={{ height: '60vh' }}
    >
      <View className="custom-cascader">
        <View className="custom-cascader-header">
          <Text className="custom-cascader-title">{title}</Text>
        </View>
        
        {/* Tab栏 */}
        <View className="custom-cascader-tabs">
          {tabsData.length > 0 ? tabsData.map((_, index) => (
            <View
              key={index}
              className={`custom-cascader-tab ${activeTab === index ? 'active' : ''}`}
              onClick={() => handleTabClick(index)}
            >
              <Text className="tab-text">
                {selectedPath[index]?.text || `请选择`}
              </Text>
              {index < tabsData.length - 1 && <ArrowRight size={12} />}
            </View>
          )) : (
            <View className="custom-cascader-tab active">
              <Text className="tab-text">请选择</Text>
            </View>
          )}
        </View>

        {/* 内容区域 */}
        <View className="custom-cascader-content">
          {loading ? (
            <View className="custom-cascader-loading">
              <Text>加载中...</Text>
            </View>
          ) : tabsData[activeTab] && tabsData[activeTab].length > 0 ? (
            <ScrollView
              className="custom-cascader-scroll"
              scrollY
              enhanced
              showScrollbar={false}
            >
              {tabsData[activeTab].map((item, index) => (
                <View
                  key={item.value || index}
                  className={`cascader-cell ${
                    selectedPath[activeTab]?.value === item.value ? 'selected' : ''
                  }`}
                  onClick={() => handleItemClick(item, activeTab)}
                >
                  <Text className="cell-title">{item.text}</Text>
                  {!item.leaf && <ArrowRight size={16} className="cell-arrow" />}
                </View>
              ))}
            </ScrollView>
          ) : (
            <View className="custom-cascader-empty">
              <Text>暂无数据</Text>
            </View>
          )}
        </View>
      </View>
    </Popup>
  )
} 