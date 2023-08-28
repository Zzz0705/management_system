export default {
    getHomeData: () => {
        return {
            code: 200,
            data: {
                tableData: [
                    {
                        name: 'oppo',
                        todayBuy: 500,
                        monthBuy: 3500,
                        totalBuy: 22000
                    },
                    {
                        name: 'vivo',
                        todayBuy: 300,
                        monthBuy: 2200,
                        totalBuy: 24000
                    },
                    {
                        name: '小米',
                        todayBuy: 1200,
                        monthBuy: 6500,
                        totalBuy: 45000
                    },
                    {
                        name: '三星',
                        todayBuy: 300,
                        monthBuy: 20000,
                        totalBuy: 34000
                    },
                    {
                        name: '苹果',
                        todayBuy: 450,
                        monthBuy: 7800,
                        totalBuy: 80000
                    }
                ]
            }
        }
    }
}