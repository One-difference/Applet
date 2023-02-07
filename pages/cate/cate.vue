<template>
	<view>
		<my-search @clicks='gotoSearch'></my-search>
		<view class="scroll-view-container">
			<!-- 左侧滑动区 -->
			<scroll-view class="left-scroll-view" scroll-y="true" :style="{height:wh+'px'}">
				<block v-for="(item,index) in cateList" :key="index">
					<view class="left-scroll-view-item" :class="{active:active==index}" @click="activeChange(index)">
						{{item.cat_name}}
					</view>
				</block>
			</scroll-view>
			<!-- 右侧滑动区 -->
			<scroll-view class="right-scroll-view" scroll-y="true" :style="{height:wh+'px'}" :scroll-top="scrollTop">
				<view class="cate-lv2" v-for="(item,index) in catelevel2" :key="index">
					<!-- 二级分类 -->
					<view class="cate-lv2-title">
						/ {{item.cat_name}} /
					</view>
					<!-- 三级分类 -->
					<view class="cate-lv3-list">
						<view class="cate-lv3-item" v-for="(item2,index2) in item.children" :key="index2"
							@click="gotoGoodList(item2)">
							<image :src="item2.cat_icon.replace('dev','web')"></image>
							<text>{{item2.cat_name}}</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import badgeMix from '@/mixins/tabbar-badge.js'
	export default {
		mixins: [badgeMix],
		data() {
			return {
				active: 0,
				//当前设备可用高度
				wh: 0,
				//分类数据列表
				cateList: [],
				//二级分类列表
				catelevel2: [],
				scrollTop: 0
			};
		},
		onLoad() {
			const sysInfo = uni.getSystemInfoSync()
			this.wh = sysInfo.windowHeight-50
			this.getCateList()
		},
		methods: {
			gotoGoodList(item2) {
				uni.navigateTo({
					url:'/subpages/goods_list/goods_list?cid='+item2.cat_id
				})
			},
			activeChange(index) {
				this.active = index
				this.catelevel2 = this.cateList[index].children
				this.scrollTop = this.scrollTop === 0 ? 1 : 0
			},
			async getCateList() {
				const {
					data
				} = await uni.$http.get('/api/public/v1/categories')
				//console.log(res)
				if (data.meta.status !== 200) {
					return uni.$showMsg()
				}

				this.cateList = data.message
				this.catelevel2 = data.message[0].children


			},
			
			gotoSearch(){
				uni.navigateTo({
					url:'/subpages/search/search'
				})
			}
		}
	}
</script>

<style lang="scss">
	.cate-lv2-title {
		font-size: 12px;
		font-weight: bold;
		text-align: center;
		padding: 15px 0;
	}

	.scroll-view-container {
		display: flex;
	}

	.left-scroll-view {
		width: 120px;
	}

	.left-scroll-view-item {
		background-color: #F7F7F7;
		line-height: 60px;
		text-align: center;
		font-size: 12px;

		&.active {
			background-color: #FFFFFF;
			position: relative;


			&::before {
				content: ' ';
				display: block;
				width: 3px;
				height: 30px;
				background-color: #C00000;
				position: absolute;
				top: 50%;
				left: 0;
				transform: translateY(-50%);
			}
		}
	}

	.cate-lv3-list {
		display: flex;
		flex-wrap: wrap;


		.cate-lv3-item {
			width: 33.3%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			margin-bottom: 10px;

			image {
				width: 60px;
				height: 60px;
			}

			text {
				font-size: 12px;
			}
		}
	}
</style>
