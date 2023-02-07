<template>
	<view>
		<view class="search-box">
			<my-search @clicks='gotoSearch'></my-search>
		</view>
		<!-- 轮播图 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
			<!--渲染轮播-->
			<swiper-item v-for="(item,index) in swiperlist" :key="index">
				<navigator class="swiper-item" :url="`/subpages/goods_detail/goods_detail?good_id=${item.goods_id}`">
					<image :src="item.image_src"></image>
				</navigator>
			</swiper-item>
		</swiper>
		<!-- 分类 -->
		<view class="nav-list">
			<view class="nav-item" v-for="(item,index) in navList" :key="index" @click="navClickHandler(item)">
				<image :src="item.image_src" class="nav-img"></image>
			</view>
		</view>
		<!--楼层-->
		<view class="floor-list">
			<!--楼层item-->
			<view class="floor-item" v-for="(item,index) in floorList" :key="index">
				<!--楼层标题-->
				<image :src="item.floor_title.image_src" class="floor-title"></image>
				<!--楼层图片-->
				<view class="floor-img-box">
					<!--左侧大图-->
					<navigator class="left-img-box" :url="item.product_list[0].url">
						<image :src="item.product_list[0].image_src"
							:style="{width:item.product_list[0].image_width+'rpx'}" mode="widthFix"></image>
					</navigator>
					<!--右侧小图-->
					<view class="right-img-box">
						<navigator :url="item2.url" class="right-img-item" v-for="(item2,index2) in item.product_list" :key="index2"
							v-if="index2 !== 0">
							<image :src="item2.image_src" :style="{width:item2.image_width+'rpx'}" mode="widthFix"></image>
						</navigator>
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import badgeMix from '@/mixins/tabbar-badge.js'
	export default {
		mixins: [badgeMix],
		data() {
			return {
				//轮播数据
				swiperlist: [],
				//分类导航数据
				navList: [],
				//楼层
				floorList: []
			};
		},
		methods: {
			async getSwiperList() {
				const {
					data
				} = await uni.$http.get('/api/public/v1/home/swiperdata')
				//console.log(res)
				if (data.meta.status !== 200) {
					return uni.$showMsg()
				}

				this.swiperlist = data.message

			},


			async getNavList() {
				const {
					data
				} = await uni.$http.get('/api/public/v1/home/catitems')
				//console.log(res)
				if (data.meta.status !== 200) {
					return uni.$showMsg()
				}

				this.navList = data.message
			},


			async getfloorList() {
				const {
					data
				} = await uni.$http.get('/api/public/v1/home/floordata')
				//console.log(res)
				if (data.meta.status !== 200) {
					return uni.$showMsg()
				}

				data.message.forEach(floor =>{
					floor.product_list.forEach(prod =>{
						prod.url = '/subpages/goods_list/goods_list?' + prod.navigator_url.split('?')[1]
					})
				})
				
				this.floorList = data.message
			},

			navClickHandler(item) {
				if (item.name === '分类') {
					uni.switchTab({
						url: `/pages/cate/cate`
					})
				}
			},
			gotoSearch(){
				uni.navigateTo({
					url:'/subpages/search/search'
				})
			}
		},
		onLoad() {
			this.getSwiperList()
			this.getNavList()
			this.getfloorList()
		}
	}
</script>

<style lang="scss">
	swiper {
		height: 330rpx;
	}

	.swiper-item,
	image {
		width: 100%;
		height: 100%;
	}

	.nav-list {
		display: flex;
		justify-content: space-around;
		margin: 15px 0;
	}

	.nav-img {
		width: 128rpx;
		height: 128rpx;
	}

	.floor-title {
		width: 100%;
		height: 60rpx;
	}

	.right-img-box {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
	}

	.floor-img-box {
		display: flex;
		padding-left: 10rpx;
	}
	
	.search-box{
		position: sticky;
		top: 0;
		z-index: 999;
	}
</style>
